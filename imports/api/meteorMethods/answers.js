import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Cards} from "../subscriptions/cards";

Meteor.methods({
	getCardAnswerContent: function (cardIds) {
		check(cardIds, [String]);

		return Cards.find({_id: {$in: cardIds}}, {fields: {_id: 1, answers: 1}}).fetch();
	}
});
