import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";
import {exportAuthorName} from "./userdata";

function exportCards(cardset_id, isCardsExport = true) {
	if (Meteor.isServer) {
		let owner = Cardsets.findOne(cardset_id).owner;
		let cards = Cards.find({
			cardset_id: cardset_id
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
			if (cards[i].originalAuthorName === undefined || (cards[i].originalAuthorName.birthname === undefined && cards[i].originalAuthorName.legacyName === undefined)) {
				cards[i].originalAuthorName = exportAuthorName(owner);
			}
			cardsString += JSON.stringify(cards[i]);
			if (i < cards.length - 1) {
				cardsString += ", ";
			}
		}
		if (isCardsExport) {
			return '[' + cardsString + ']';
		} else {
			return cardsString;
		}
	}
}

Meteor.methods({
	exportCards: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne(cardset_id);
		if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || cardset.shuffled) {
			throw new Meteor.Error("not-authorized");
		}
		return exportCards(cardset._id);
	},
	exportCardset: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({
			_id: cardset_id
		}, {
			fields: {
				'cardGroups': 0,
				'_id': 0
			}
		});
		if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (cardset.originalAuthorName === undefined || (cardset.originalAuthorName.birthname === undefined && cardset.originalAuthorName.legacyName === undefined)) {
			cardset.originalAuthorName = exportAuthorName(cardset.owner);
		}
		let cardsetString = JSON.stringify(cardset);
		let cardString = exportCards(cardset_id, false);
		if (cardString.length) {
			cardsetString += (", " + cardString);
		}
		return '[' + cardsetString + ']';
	}
});
