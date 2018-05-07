import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";

Meteor.methods({
	exportCards: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne(cardset_id);
		if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		let cards = Cards.find({
			cardset_id: cardset._id
		}, {
			fields: {
				'cardset_id': 0,
				'cardGroup': 0,
				'_id': 0
			}, sort: {
				'subject': 1,
				'front': 1
			}
		}).fetch();

		let cardsString = '';

		for (let i = 0; i < cards.length; i++) {
			cardsString += JSON.stringify(cards[i]);
			if (i < cards.length - 1) {
				cardsString += ", ";
			}
		}
		return cardsString;
	}
});
