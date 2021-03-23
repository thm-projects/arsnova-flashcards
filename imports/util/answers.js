import {LeitnerUserCardStats} from "../api/subscriptions/leitner/leitnerUserCardStats";
import {Cards} from "../api/subscriptions/cards";
import {Session} from "meteor/session";
import {LeitnerActivationDay} from "../api/subscriptions/leitner/leitnerActivationDay";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {CardVisuals} from "./cardVisuals";
import {CardType} from "./cardTypes";
import {Route} from "./route";
import shuffle from "knuth-shuffle-seeded";
import "/imports/api/meteorMethods/answers";
import {cubeTransitionTime, flipTransitionTime} from "../config/cardVisuals";
import * as answerConfig from "../config/answers";

let randomizedNumber = Math.random();


export let AnswerUtilities = class AnswerUtilities {
	static setNewRandomizedNumber () {
		randomizedNumber = Math.random();
	}

	static randomizeAnswers (cardId, answers) {
		return shuffle(answers, cardId + randomizedNumber);
	}

	static isAnswerWrong (correctAnswers, selectedAnswers) {
		let isAnswerWrong = true;
		if (_.difference(selectedAnswers.sort(), correctAnswers.sort()).length > 0 || selectedAnswers.length !== correctAnswers.length) {
			return isAnswerWrong;
		}
	}


	/**
	 * Returns the answers of the requested cards
	 * @param cardIds Ids of the cards
	 * @param cardsetId Id of the cardset
	 * @param disableAnswers Doesn't return explanations and right answers if enabled
	 */
	static getAnswerContent (cardIds, cardsetId, disableAnswers = false) {
		let cards = Cards.find({_id: {$in: cardIds}}, {fields: {_id: 1, answers: 1}}).fetch();

		if (disableAnswers) {
			let cardsWithVisibleAnswers = LeitnerUserCardStats.find({
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					card_id: {$in: cardIds}},
				{fields: {card_id: 1, submitted: 1}}).fetch().map(function (x) {
				if (x.submitted === true) {
					return x.card_id;
				}
			});

			cards.forEach(function (card) {
				if (card.answers !== undefined && card.answers.rightAnswers !== undefined && !cardsWithVisibleAnswers.includes(card._id)) {
					card.answers.rightAnswers = [];
					card.answers.content.forEach(function (content) {
						if (content.explanation !== undefined) {
							content.explanation = "";
						}
					});
				}
			});
		}
		return cards;
	}

	static resetSelectedAnswers () {
		Session.set('selectedAnswers', []);
	}

	static getActiveCardStatus () {
		return LeitnerUserCardStats.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam("_id"),
			card_id: Session.get('activeCard')
		});
	}

	static getActiveCardHistory () {
		let leitnerTask = LeitnerActivationDay.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam("_id")
		}, {sort: {session: -1, createdAt: -1}, fields: {_id: 1}});
		if (leitnerTask !== undefined) {
			return LeitnerPerformanceHistory.findOne({
				user_id: Meteor.userId(),
				card_id: Session.get('activeCard'),
				task_id: leitnerTask._id,
				cardset_id: FlowRouter.getParam("_id")});
		}
	}

	static focusOnAnswerIfSubmitted () {
		let leitner = this.getActiveCardStatus();
		if (leitner !== undefined && leitner.submitted !== undefined && leitner.submitted === true && leitner.active !== undefined && leitner.active === true) {
			let answerSideId = CardType.getAnswerSideID(Session.get('cardType'));
			if (Session.get('is3DActive')) {
				CardVisuals.rotateCube(CardType.getCubeSideName(answerSideId), true);
			} else {
				Session.set('activeCardSide', answerSideId);
			}
			Session.set('isQuestionSide', false);
		}
	}

	static gotLeitnerMcEnabled () {
		if (Route.isBox()) {
			let gotMcQuestion = false;
			let activeAnswers = Session.get('activeCardAnswers');
			let activeCardId = Session.get('activeCard');
			if (activeAnswers !== undefined) {
				activeAnswers.forEach(function (card) {
					if (card.answers !== undefined && card.answers.enabled  === true && card._id === activeCardId) {
						gotMcQuestion = true;
					}
				});
			}
			return gotMcQuestion;
		}
	}

	static playSound (correctAnswers, selectedAnswers) {
		let cardAnswers = [];
		let transition;

		if (Session.get('is3DActive')) {
			transition = cubeTransitionTime * 1000;
		} else if ((CardType.hasCardTwoSides(true, Session.get('cardType')))) {
			transition = flipTransitionTime * 1000;
		} else {
			transition = 0;
		}
		correctAnswers.forEach(function (answers) {
			if (answers._id === Session.get('activeCard')) {
				cardAnswers = answers.answers.rightAnswers;
			}
		});
		if (AnswerUtilities.isAnswerWrong(cardAnswers, selectedAnswers)) {
			setTimeout(function () {
				answerConfig.fail.play();
			}, transition);
		} else {
			setTimeout(function () {
				answerConfig.success.play();
			}, transition);
		}
	}
};
