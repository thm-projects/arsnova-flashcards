import {Leitner} from "../api/subscriptions/leitner";
import {Cards} from "../api/subscriptions/cards";
import {Session} from "meteor/session";
import {LeitnerTasks} from "../api/subscriptions/leitnerTasks";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LeitnerHistory} from "../api/subscriptions/leitnerHistory";
import {CardVisuals} from "./cardVisuals";
import {CardType} from "./cardTypes";
import {Route} from "./route";
import shuffle from "knuth-shuffle-seeded";
import {Meteor} from "meteor/meteor";
import {LeitnerSimulator} from "./leitnerSimulator";
import {Cardsets} from "../api/subscriptions/cardsets";
import * as config from "../config/leitner";
import {Workload} from "../api/subscriptions/workload";
import {LeitnerUtilities} from "./leitner";
import {BonusForm} from "./bonusForm";

let randomizedNumber = Math.random();

export let AnswerUtilities = class AnswerUtilities {
	static setNewRandomizedNumber () {
		randomizedNumber = Math.random();
	}

	static randomizeAnswers (cardId, answers) {
		return shuffle(answers, cardId + randomizedNumber);
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
			let cardsWithVisibleAnswers = Leitner.find({
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
		return Leitner.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam("_id"),
			card_id: Session.get('activeCard')
		});
	}

	static getActiveCardHistory () {
		let leitnerTask = LeitnerTasks.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam("_id")
		}, {sort: {session: -1, createdAt: -1}, fields: {_id: 1}});
		if (leitnerTask !== undefined) {
			return LeitnerHistory.findOne({
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

	static nextMCCard (activeCardId, cardsetId, timestamps) {
		let query = {
			card_id: activeCardId,
			user_id: Meteor.userId(),
			cardset_id: cardsetId,
			submitted: true,
			active: true
		};
		let leitner;
		if (Meteor.isServer) {
			leitner = Leitner.findOne(query);
		} else {
			leitner = LeitnerSimulator.leitnerCards().findOne(query);
		}

		let task;
		query = {cardset_id: cardsetId, user_id: Meteor.userId()};
		let options = {fields: {_id: 1}, sort: {session: -1, createdAt: -1}};
		if (Meteor.isServer) {
			task = LeitnerTasks.findOne(query, options);
		} else {
			task = LeitnerSimulator.leitnerTask().findOne(query, options);
		}
		if (leitner !== undefined && task !== undefined) {
			query = {
				card_id: activeCardId,
				user_id: Meteor.userId(),
				cardset_id: cardsetId,
				submitted: true
			};
			let params = {$set: {
					active: false
				}};
			Leitner.update(query, params);

			query = {
				card_id: activeCardId,
				user_id: Meteor.userId(),
				cardset_id: cardsetId,
				task_id: task._id
			};
			params = {$set: {
					timestamps: timestamps
				}};
			LeitnerHistory.update(query, params);
		}
	}

	static setMCAnswers (cardIds, activeCardId, cardsetId, userAnswers, timestamps) {
		let activeLeitner;
		let query = {
			card_id: activeCardId,
			user_id: Meteor.userId(),
			cardset_id: cardsetId
		};
		if (Meteor.isServer) {
			activeLeitner = Leitner.findOne(query);
		} else {
			activeLeitner = LeitnerSimulator.leitnerCards().findOne(query);
		}

		if (activeLeitner !== undefined && activeLeitner.submitted !== true) {
			query = {cardset_id: cardsetId, user_id: Meteor.userId()};
			let options = {fields: {_id: 1}, sort: {session: -1, createdAt: -1}};
			let task;
			if (Meteor.isServer) {
				task = LeitnerTasks.findOne(query, options);
			} else {
				task = LeitnerSimulator.leitnerTask().findOne(query, options);
			}

			let card = Cards.findOne({_id: activeCardId});
			let cardset = Cardsets.findOne({_id: activeLeitner.cardset_id});
			if (task !== undefined && card !== undefined && cardset !== undefined) {
				if (Meteor.isClient) {
					cardset.learningInterval = BonusForm.getIntervals(true);
				}
				userAnswers = userAnswers.sort();

				// answer - 0 = known, 1 = not known
				let answer = 0;
				if (_.difference(userAnswers, card.answers.rightAnswers).length > 0 || userAnswers.length !== card.answers.rightAnswers.length) {
					answer = 1;
				}
				let selectedBox = activeLeitner.box + 1;

				if (answer) {
					if (config.wrongAnswerMode === 1) {
						if (activeLeitner.box > 1) {
							selectedBox = activeLeitner.box - 1;
						} else {
							selectedBox = 1;
						}
					} else {
						selectedBox = 1;
					}
				}
				let workload;
				query = {cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id};
				if (Meteor.isServer) {
					workload = Workload.findOne(query);
				} else {
					workload = LeitnerSimulator.workload().findOne(query);
				}

				let lowestPriority = workload.leitner.nextLowestPriority;
				let newPriority = lowestPriority[selectedBox - 1];

				query = {
					_id: activeLeitner._id
				};
				let params = {$set: {
						box: selectedBox,
						nextDate: this.getNextDate(cardset.learningInterval, selectedBox),
						currentDate: new Date(),
						priority: newPriority,
						submitted: true
					}};
				if (Meteor.isServer) {
					Leitner.update(query, params);
				} else {
					LeitnerSimulator.leitnerCards().update(query, params);
				}

				query = {
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					task_id: task._id
				};
				params = {$set: {
						timestamps: timestamps,
						answer: answer,
						"mcAnswers.user": userAnswers,
						"mcAnswers.card": card.answers.rightAnswers
					}};
				if (Meteor.isServer) {
					LeitnerHistory.update(query, params);
				} else {
					LeitnerSimulator.leitnerHistory().update(query, params);
				}
				return this.getAnswerContent(cardIds, cardsetId, true);
			} else {
				throw new Meteor.Error("Leitner Task not found");
			}
		} else {
			return this.getAnswerContent(cardIds, cardsetId, true);
		}
	}

	static getNextDate (learningInterval, selectedBox) {
		if (Meteor.isServer) {
			return moment().add(learningInterval[selectedBox - 1], 'days').toDate();
		} else {
			let currentSimulatedDate = moment(LeitnerSimulator.getActiveSimulatorDay());
			return currentSimulatedDate.add(learningInterval[selectedBox - 1], 'days').toDate();
		}
	}

	static updateSimpleAnswer (cardset_id, card_id, answer, timestamps) {
		let cardset = Cardsets.findOne({_id: cardset_id});

		if (cardset !== undefined) {
			if (Meteor.isClient) {
				cardset.learningInterval = BonusForm.getIntervals(true);
			}
			let query = {};

			query.card_id = card_id;
			query.cardset_id = cardset_id;
			query.user_id = Meteor.userId();
			query.active = true;

			let currentLearned;
			if (Meteor.isServer) {
				currentLearned = Leitner.findOne(query);
			} else {
				currentLearned = LeitnerSimulator.leitnerCards().findOne(query);
			}

			if (currentLearned !== undefined) {
				let selectedBox = currentLearned.box + 1;

				// Move card back as the answer was wrong "not known"
				if (answer) {
					if (config.wrongAnswerMode === 1) {
						if (currentLearned.box > 1) {
							selectedBox = currentLearned.box - 1;
						} else {
							selectedBox = 1;
						}
					} else {
						selectedBox = 1;
					}
				} else {
					let cardCardType;
					if (cardset.shuffled) {
						let cardCardset = Cardsets.findOne({_id: currentLearned.original_cardset_id});
						cardCardType = cardCardset.cardType;
					} else {
						cardCardType = cardset.cardType;
					}
					if (CardType.gotNonRepeatingLeitner(cardCardType)) {
						//Move to the last box if card Type got no repetition
						selectedBox = 6;
					}
				}
				let query = {cardset_id: currentLearned.cardset_id, user_id: currentLearned.user_id};
				let workload;
				if (Meteor.isServer) {
					workload = Workload.findOne(query);
				} else {
					workload = LeitnerSimulator.workload().findOne(query);
				}

				let lowestPriority = workload.leitner.nextLowestPriority;
				let newPriority = lowestPriority[selectedBox - 1];
				if (selectedBox === 6) {
					lowestPriority = 0;
				}


				query = {
					_id: currentLearned._id
				};
				let params = {
					$set: {
						box: selectedBox,
						active: false,
						nextDate: this.getNextDate(cardset.learningInterval, selectedBox),
						currentDate: LeitnerUtilities.getCurrentDate(),
						priority: newPriority
					}
				};

				if (Meteor.isServer) {
					Leitner.update(query, params);
				} else {
					LeitnerSimulator.leitnerCards().update(query, params);
				}


				query = {cardset_id: currentLearned.cardset_id, user_id: currentLearned.user_id};
				let options = {sort: {session: -1}};
				let leitnerTask;
				if (Meteor.isServer) {
					leitnerTask = LeitnerTasks.findOne(query, options);
				} else {
					leitnerTask = LeitnerTasks.findOne(query);
				}
				if (leitnerTask !== undefined) {
					delete query.active;
					query.task_id = leitnerTask._id;
					params = {
						$set: {
							box: selectedBox,
							answer: answer ? 1 : 0,
							timestamps: timestamps
						}
					};

					if (Meteor.isServer) {
						LeitnerHistory.update(query, params);
					} else {
						LeitnerSimulator.leitnerHistory().update(query, params);
					}
				}

				if (selectedBox !== 6) {
					lowestPriority[selectedBox - 1] = newPriority - 1;
					query = {cardset_id: currentLearned.cardset_id, user_id: currentLearned.user_id};
					params = {
						$set: {
							"leitner.nextLowestPriority": lowestPriority
						}
					};
					if (Meteor.isServer) {
						Workload.update(query, params);
					} else {
						LeitnerSimulator.workload().update(query, params);
					}
				}
			}
			LeitnerUtilities.updateLeitnerWorkload(cardset_id, Meteor.userId());
		}
	}
};
