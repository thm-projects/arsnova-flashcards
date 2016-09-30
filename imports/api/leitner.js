import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Learned} from "./learned.js";

function getActiveCard(cardset_id, user) {
	return Learned.findOne({
		"cardset_id": cardset_id,
		"user_id": user,
		"active": true
	});
}

function getCardCount(cardset_id, user, box) {
	return Learned.find({
		"cardset_id": cardset_id,
		"user_id": user,
		"box": box,
		"nextDate": {$lte: new Date()}
	}).count();
}
function getCardset(cardset_id) {
	return Cardsets.findOne({"_id": cardset_id});
}

function getLearners(cardset_id) {
	var data = Learned.find({"cardset_id": cardset_id}).fetch();
	return _.uniq(data, false, function (d) {
		return d.user_id;
	});
}

function noCardsLeft(cardCount) {
	return cardCount.reduce(function (prev, cur) {
		return prev + cur;
	});
}

// i-loop: Get all cards that the user can learn right now
// k-loop: Check the card counter of each Box in reverse and if empty, summate its percentage to the next box with cards
// j-loop: Summate all percentages of boxes with cards to reach 100%
// l-loop: Mark the cards that the user has to learn next
function setCards(cardset, user) {
	var algorithm = [0.5, 0.2, 0.15, 0.1, 0.05];
	var cardCount = [];
	for (var i = 0; i < algorithm.length; i++) {
		cardCount[i] = getCardCount(cardset._id, user.user_id, i + 1);
	}

	if (noCardsLeft(cardCount) === 0) {
		return;
	}
	for (var k = algorithm.length; k > 0; k--) {
		if (cardCount[k] === 0 && k - 1 >= 0) {
			algorithm[k - 1] += algorithm[k];
			algorithm[k] = 0;
		}
	}

	if (cardCount[0] === 0) {
		for (var j = 0; j < algorithm.length; j++) {
			if (cardCount[j] !== 0) {
				algorithm[j] = algorithm[j] * (1 / (1 - algorithm[0]));
			}
		}
		algorithm[0] = 0;
	}

	for (var l = 0; l < algorithm.length; l++) {
		Learned.update({
			"cardset_id": cardset._id,
			"user_id": user.user_id,
			"box": (l + 1),
			"nextDate": {$lte: new Date()}
		}, {
			$set: {
				"active": true,
				"currentDate": new Date()
			}
		}, {multi: true, limit: cardset.maxCards * algorithm[l]});
	}
}

function resetCards(cardset, user) {
	Learned.update({"cardset_id": cardset._id, "user_id": user.user_id}, {
		$set: {
			"box": 1,
			"active": false,
			"nextDate": new Date(),
			"currentDate": new Date()
		}
	}, {multi: true});
	setCards(cardset, user);
}

Meteor.methods({
	updateLeitnerCards: function (cardset_id) {
		var cardset = getCardset(cardset_id);
		var learners = getLearners(cardset._id);
		for (var i = 0; i < learners.length; i++) {
			var activeCard = getActiveCard(cardset._id, learners[i].user_id);
			if (!activeCard) {
				setCards(cardset, learners[i]);
			} else if ((activeCard.currentDate.getTime() + cardset.daysBeforeReset * 86400000) < new Date().getTime()) {
				resetCards(cardset, learners[i]);
			}
		}
	}
});
