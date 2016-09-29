import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Learned} from "./learned.js";

function getActiveLeitnerCard(cardset_id, user) {
	return Learned.findOne({
		"cardset_id": cardset_id,
		"user_id": user,
		"active": true
	});
}

function getLeitnerCards(cardset_id, user) {
	return Learned.find({
		"cardset_id": cardset_id,
		"user_id": user,
		"box": {$nin: [6]},
		"nextDate": {$lte: new Date()}
	});
}
function getLeitnerCardset(cardset_id) {
	return Cardsets.find({"cardset_id": cardset_id});
}

function getLeitnerLearners(cardset_id) {
	var data = Learned.find({"cardset_id": cardset_id}).fetch();
	return _.uniq(data, false, function (d) {
		return d.user_id;
	});
}

function setLeitnerCards(cardset_id, user) {
	Learned.update({"cardset_id": cardset_id, "user_id": user}, {$set: {"active": false}});
}

Meteor.methods({
	checkLeitnerCards: function (cardset_id) {
		var cardset = getLeitnerCardset(cardset_id);
		var learners = getLeitnerLearners(cardset_id);
		for (var u = 0; u < learners.length; u++) {
			var activeCard = getActiveLeitnerCard(cardset_id, u);
			if (!activeCard || (activeCard.currentDate + cardset.daysBeforeReset) <= new Date()) {
				setLeitnerCards(cardset_id, u);
			}
		}
	},
	getLeitnerLearners: function (cardset_id) {
		return getLeitnerCards(cardset_id);
	}
});
