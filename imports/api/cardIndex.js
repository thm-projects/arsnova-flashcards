import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Leitner} from "./subscriptions/leitner";
import {Wozniak} from "./subscriptions/wozniak";
import {Cards} from "./subscriptions/cards";
import {Cardsets} from "./subscriptions/cardsets";
import {Route} from "./route";
import {CardType} from "./cardTypes";
import {CardNavigation} from "./cardNavigation";
import {CardVisuals} from "./cardVisuals";
import {Utilities} from "./utilities";
import {TranscriptBonus} from "./subscriptions/transcriptBonus";

let cardIndex = [];

export let CardIndex = class CardIndex {

	static getCards () {
		let result;
		if (Route.isBox()) {
			result = this.getLeitnerCards();
		}
		if (Route.isCardset() || Route.isPresentation() || Route.isDemo() || Route.isMakingOf()) {
			result = this.getCardsetCards();
		}
		if (Route.isMemo()) {
			result = this.getMemoCards();
		}
		if (Route.isEditMode()) {
			result = this.getEditModeCard();
			if (Route.isNewCard()) {
				Session.set('activeCard', -1);
			}
		}
		if (Session.get('activeCard') === undefined && result[0] !== undefined) {
			CardNavigation.setActiveCardData(result[0]._id);
		}
		Session.set('activeIndexCards', CardVisuals.setTypeAndDifficulty(result));
		Session.set('activeIndexLength', Session.get('activeIndexCards').length);
		return Session.get('activeIndexCards');
	}

	static getCardIndex () {
		return cardIndex;
	}

	static initializeIndex (forcedCardset = undefined) {
		if (Meteor.isServer) {
			cardIndex = this.defaultIndex(forcedCardset);
		} else {
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
	}

	static defaultIndex (forcedCardset = undefined) {
		let cardIndex = [];
		let sortQuery;
		let indexCards = [];
		let cardset;
		if (!Meteor.isServer && Route.isTranscript()) {
			if (Route.isPresentationTranscriptReview()) {
				let query = {cardset_id: Router.current().params._id, rating: 0};
				if (Session.get('transcriptBonusReviewFilter') !== undefined && Session.get('transcriptBonusReviewFilter') !== null) {
					query.card_id = Session.get('transcriptBonusReviewFilter');
				}
				let indexCards = TranscriptBonus.find(query,{sort: {date: 1, user_id: 1}, fields: {card_id: 1}}).fetch();
				indexCards.forEach(function (indexCard) {
					cardIndex.push(indexCard.card_id);
				});
				return cardIndex;
			} else {
				return 0;
			}
		} else {
			if (!Meteor.isServer && Route.isDemo()) {
				cardset = Cardsets.findOne({kind: 'demo', name: 'DemoCardset', shuffled: true});
			} else if (!Meteor.isServer && Route.isMakingOf()) {
				cardset = Cardsets.findOne({kind: 'demo', name: 'MakingOfCardset', shuffled: true});
			} else if (!forcedCardset) {
				cardset = Cardsets.findOne(Router.current().params._id);
			} else {
				cardset = forcedCardset;
			}
			if (cardset.shuffled) {
				let cardGroups = Cardsets.find({_id: {$in: cardset.cardGroups}}, {
					sort: {name: 1},
					fields: {_id: 1, cardType: 1, sortType: 1}
				});
				cardGroups.forEach(function (cardGroup) {
					sortQuery = CardType.getSortQuery(cardGroup.cardType, cardGroup.sortType);
					indexCards = Cards.find({cardset_id: cardGroup._id}, {
						sort: sortQuery, fields: {_id: 1}
					});
					indexCards.forEach(function (indexCard) {
						cardIndex.push(indexCard._id);
					});
				});
			} else {
				sortQuery = CardType.getSortQuery(cardset.cardType, cardset.sortType);
				indexCards = Cards.find({cardset_id: cardset._id}, {sort: sortQuery, fields: {_id: 1}});
				indexCards.forEach(function (indexCard) {
					cardIndex.push(indexCard._id);}
				);
			}
			return cardIndex;
		}
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
		}).fetch();
		let filter = Utilities.getUniqData(indexCards, 'card_id');
		if (indexCards.length) {
			cardIndex = this.defaultIndex(Cardsets.findOne({_id: Router.current().params._id})).filter(function (id) {
				return filter.indexOf(id) > -1;
			});
		}
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
		this.initializeIndex();
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
			if (cardIndex.length > 1) {
				cardIndexFilter.push(cardIndex[nextCardIndex]);
				if (!isLearningMode) {
					if (activeCardIndex === 0) {
						previousCardIndex = cardIndex.length - 1;
					} else {
						previousCardIndex = activeCardIndex - 1;
					}
					cardIndexFilter.push(cardIndex[previousCardIndex]);
				}
			}
		} else {
			cardIndexFilter.push(cardIndex[0]);
			if (cardIndex.length > 1) {
				cardIndexFilter.push(cardIndex[1]);
				if (!isLearningMode) {
					cardIndexFilter.push(cardIndex[cardIndex.length - 1]);
				}
			}
		}
		return cardIndexFilter;
	}

	static sortQueryResult (cardIndexFilter, query, isLeitnerOrWozniak = false) {
		let result = [];
		for (let i = 0; i < cardIndexFilter.length; i++) {
			for (let q = 0; q < query.length; q++) {
				if (isLeitnerOrWozniak) {
					if (cardIndexFilter[i] === query[q].card_id) {
						result.push(query[q]);
					}
				} else {
					if (cardIndexFilter[i] === query[q]._id) {
						result.push(query[q]);
					}
				}
			}
		}
		return result;
	}

	/**
	 * Get a set of cards for the cardset and presentation view
	 * @return {Collection} The card set
	 */
	static getCardsetCards () {
		let query = "";
		if (Route.isPresentationTranscript()) {
			return Cards.find(Router.current().params.card_id).fetch();
		} else if (Route.isPresentationTranscriptReview()) {
			let cardIndexFilter = this.getCardIndexFilter();
			query = Cards.find({
				_id: {$in: cardIndexFilter},
				cardset_id: "-1"
			}).fetch();
			return this.sortQueryResult(cardIndexFilter, query);
		} else {
			let cardIndexFilter = this.getCardIndexFilter();
			if (Session.get('activeCardset').shuffled) {
				query = Cards.find({
					_id: {$in: cardIndexFilter},
					cardset_id: {$in: Session.get('activeCardset').cardGroups}
				}).fetch();
			} else {
				query = Cards.find({
					_id: {$in: cardIndexFilter},
					cardset_id: Router.current().params._id
				}).fetch();
			}
			return this.sortQueryResult(cardIndexFilter, query);
		}
	}

	/**
	 * Get a set of cards for the learning algorithm by Leitner.
	 * @return {Collection} The card set
	 */
	static getLeitnerCards () {
		let cards = [];
		let cardIndexFilter = this.getCardIndexFilter();
		let learnedCards = Leitner.find({
			card_id: {$in: cardIndexFilter},
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}, {fields: {card_id: 1}}).fetch();
		learnedCards = this.sortQueryResult(cardIndexFilter, learnedCards, true);
		learnedCards.forEach(function (learnedCard) {
			let card = Cards.findOne({
				_id: learnedCard.card_id
			});
			cards.push(card);
		});
		return cards;
	}

	/**
	 * Get the Session Data of the card
	 * @return {Collection} The Session Data of the card.
	 */
	static getEditModeCard () {
		this.initializeIndex();
		let id = "-1";
		if (Route.isEditCard()) {
			if (Session.get('activeCard') === undefined) {
				Session.set('activeCard', Router.current().params.card_id);
			}
			id = Session.get('activeCard');
		} else {
			Session.set('activeCard', undefined);
		}
		let cardset_id = -1;
		if (!Route.isTranscript()) {
			cardset_id = Router.current().params._id;
		}
		return [{
			"_id": id,
			"subject": Session.get('subject'),
			"difficulty": Session.get('difficultyColor'),
			"learningGoalLevel": Session.get('learningGoalLevel'),
			"backgroundStyle": Session.get('backgroundStyle'),
			"front": Session.get('content1'),
			"back": Session.get('content2'),
			"hint": Session.get('content3'),
			"lecture": Session.get('content4'),
			"top": Session.get('content5'),
			"bottom": Session.get('content6'),
			"cardset_id": cardset_id,
			"cardGroup": 0,
			"cardType": Session.get('cardType'),
			"centerTextElement": Session.get('centerTextElement'),
			"alignType": Session.get('alignType'),
			"date": Session.get('cardDate')
		}];
	}

	/**
	 * Get a set of cards for the supermemo algorithm.
	 * @return {Collection} The card collection
	 */
	static getMemoCards () {
		let cards = [];
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		let cardIndexFilter = this.getCardIndexFilter();
		actualDate.setHours(0, 0, 0, 0);
		let learnedCards = Wozniak.find({
			card_id: {$in: cardIndexFilter},
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			nextDate: {
				$lte: actualDate
			}
		}, {fields: {card_id: 1}}).fetch();
		learnedCards = this.sortQueryResult(cardIndexFilter, learnedCards, true);
		learnedCards.forEach(function (learnedCard) {
			let card = Cards.findOne({
				_id: learnedCard.card_id
			});
			cards.push(card);
		});
		return cards;
	}

	static getNextCardID (card_id) {
		let cardIndex = this.getCardIndex();
		let index = cardIndex.findIndex(item => item === card_id);
		++index;
		if (index >= cardIndex.length) {
			return cardIndex[0];
		} else {
			return cardIndex[index];
		}
	}

	static getActiveCardIndex (card_id) {
		if (Route.isTranscript() && !Route.isPresentationTranscriptReview()) {
			return 0;
		} else {
			let cardIndex = this.getCardIndex();
			return cardIndex.findIndex(item => item === card_id) + 1;
		}
	}
};
