import {Meteor} from "meteor/meteor";
import {Cardsets} from "../api/subscriptions/cardsets";
import {Cards} from "../api/subscriptions/cards";
import {exportAuthorName} from "./userData";

export function exportCards(cardset_id, isCardsExport = true, exportWithIds = false) {
	if (Meteor.isServer) {
		let owner = Cardsets.findOne(cardset_id).owner;
		var cards = [];
		if (exportWithIds) {
			cards = Cards.find({
				cardset_id: cardset_id
			}, {
				fields: {
					'cardset_id': 0,
					'cardGroup': 0,
					'cardType': 0,
					'difficulty': 0
				}, sort: {
					'subject': 1,
					'front': 1
				}
			}).fetch();
		} else {
			cards = Cards.find({
				cardset_id: cardset_id
			}, {
				fields: {
					'cardset_id': 0,
					'cardGroup': 0,
					'_id': 0,
					'cardType': 0,
					'difficulty': 0
				}, sort: {
					'subject': 1,
					'front': 1
				}
			}).fetch();
		}

		let cardsString = '';

		for (let i = 0; i < cards.length; i++) {
			if (cards[i].originalAuthorName === undefined || (cards[i].originalAuthorName.birthname === undefined && cards[i].originalAuthorName.legacyName === undefined)) {
				cards[i].originalAuthorName = exportAuthorName(owner);
			}
			cardsString += JSON.stringify(cards[i], null, 2);
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
