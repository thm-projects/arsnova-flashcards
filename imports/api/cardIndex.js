import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Leitner, Wozniak} from "./learned";
import {Cards} from "./cards";
import CardType from "./cardTypes";
import {Cardsets} from "./cardsets";

let cardIndex = [];

class CardIndex {

	static getCardIndex () {
		return cardIndex;
	}

	static initializeIndex () {
		switch (Router.current().route.getName()) {
			case "box":
				cardIndex = this.leitnerIndex();
				break;
			case "memo":
				cardIndex = this.wozniakIndex();
				break;
			default :
				cardIndex = this.defaultIndex();
				break;
		}
	}

	static defaultIndex () {
		let cardIndex = [];
		let sortQuery;
		let indexCards = [];
		let cardset = Cardsets.findOne(Router.current().params._id);
		if (CardType.gotSidesSwapped(cardset.cardType)) {
			sortQuery = {subject: 1, back: 1};
		} else {
			sortQuery = {subject: 1, front: 1};
		}
		if (cardset.shuffled) {
			let cardGroups = Cardsets.find({_id: {$in: cardset.cardGroups}}, {
				sort: {name: 1},
				fields: {_id: 1}
			});
			cardGroups.forEach(function (cardGroup) {
				indexCards = Cards.find({cardset_id: cardGroup._id}, {
					sort: sortQuery, fields: {_id: 1}
				});
				indexCards.forEach(function (indexCard) {
					cardIndex.push(indexCard._id);
				});
			});
		} else {
			indexCards = Cards.find({cardset_id: Router.current().params._id}, {sort: sortQuery, fields: {_id: 1}});
			indexCards.forEach(function (indexCard) {
				cardIndex.push(indexCard._id);
			});
		}
		return cardIndex;
	}

	static leitnerIndex () {
		let cardIndex = [];
		let indexCards = Leitner.find({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			active: true
		}, {
			fields: {
				card_id: 1
			}
		});
		indexCards.forEach(function (indexCard) {
			cardIndex.push(indexCard.card_id);
		});
		return cardIndex;
	}

	static wozniakIndex () {
		let cardIndex = [];
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);
		let indexCards = Wozniak.find({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			nextDate: {
				$lte: actualDate
			}
		}, {
			sort: {
				nextDate: 1,
				priority: 1
			},
			fields: {
				card_id: 1
			}
		}).fetch();
		indexCards.forEach(function (indexCard) {
			cardIndex.push(indexCard.card_id);
		});
		return cardIndex;
	}

	static getCardIndexFilter () {
		let isLearningMode = (Router.current().route.getName() === "box" || Router.current().route.getName() === "memo");
		let cardIndexFilter = [];
		if (Session.get('activeCard') !== undefined) {
			let activeCardIndex = cardIndex.findIndex(item => item === Session.get('activeCard'));
			let nextCardIndex;
			let previousCardIndex;
			if (activeCardIndex === cardIndex.length - 1) {
				nextCardIndex = 0;
			} else {
				nextCardIndex = activeCardIndex + 1;
			}

			cardIndexFilter.push(cardIndex[activeCardIndex]);
			cardIndexFilter.push(cardIndex[nextCardIndex]);
			if (!isLearningMode) {
				if (activeCardIndex === 0) {
					previousCardIndex = cardIndex.length - 1;
				} else {
					previousCardIndex = activeCardIndex - 1;
				}
				cardIndexFilter.push(cardIndex[previousCardIndex]);
			}
		} else {
			cardIndexFilter.push(cardIndex[0]);
			cardIndexFilter.push(cardIndex[1]);
			if (!isLearningMode) {
				cardIndexFilter.push(cardIndex[cardIndex.length - 1]);
			}
		}
		return cardIndexFilter;
	}
}

module.exports = CardIndex;
