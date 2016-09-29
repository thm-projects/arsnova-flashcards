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

function getCards(cardset_id, user) {
	return Learned.find({
		"cardset_id": cardset_id,
		"user_id": user,
		"box": {$nin: [6]},
		"nextDate": {$lte: new Date()}
	}).fetch();
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

function setCards(cardset, user) {
	var cards = getCards(cardset._id, user);
}

function resetCards(cardset, user) {
	Learned.update({"cardset_id": cardset._id, "user_id": user}, {
		$set: {
			"box": 0,
			"active": false,
			"nextDate": new Date()
		}
	}, {multi: true});
	setCards(cardset._id, user);
}

Meteor.methods({
	updateLeitnerCards: function (cardset_id) {
		var cardset = getCardset(cardset_id);
		var learners = getLearners(cardset._id);
		for (var i = 0; i < learners.length; i++) {
			var activeCard = getActiveCard(cardset._id, learners[i].user_id);
			if (!activeCard) {
				setCards(cardset, learners[i].user_id);
			} else if ((activeCard.currentDate.getTime() + cardset.daysBeforeReset * 86400000) < new Date().getTime()) {
				resetCards(cardset, learners[i].user_id);
			}
		}
	}
});
