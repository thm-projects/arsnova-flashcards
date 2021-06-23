import {Meteor} from "meteor/meteor";
import {LeitnerUserCardStats} from "../api/subscriptions/leitner/leitnerUserCardStats";
import {Cardsets} from "../api/subscriptions/cardsets";
import * as bonusFormConfig from "../config/bonusForm";
import {CardType} from "./cardTypes";
import {Cards} from "../api/subscriptions/cards";
import * as config from "../config/leitner";
import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";
import {CardIndex} from "./cardIndex";
import {Utilities} from "./utilities";
import {LeitnerActivationDay} from "../api/subscriptions/leitner/leitnerActivationDay";
import {PomodoroTimer} from "./pomodoroTimer";
import {Bonus} from "./bonus";
import {LeitnerLearningPhaseUtilities} from "./learningPhase";

// Allow the user to update the timer a few seconds earlier to prevent close calls deny an update
let minimumSecondThreshold = 57;

function gotPriority(array, card_id, priority) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].card_id === card_id) {
			if (array[i].priority === priority) {
				return true;
			}
		}
	}
}

export let LeitnerUtilities = class LeitnerUtilities {
	static setEndBonusPoints (cardset, leitnerActivationDay, result) {
		if (cardset.learningActive && result.box === 6) {
			const [learnable, box6] = LeitnerUserCardStats.find({
					cardset_id: cardset._id,
					user_id: Meteor.userId()
				},
				{
					fields: {_id: 0, box: 1}
				}).fetch()
				.reduce((acc, card) => {
					acc[0]++;
					if (card.box === 6) {
						acc[1]++;
					}
					return acc;
				}, [0, 0]);
			const bonusPoints = Bonus.getAchievedBonus(box6, LeitnerLearningPhaseUtilities.getActiveBonus(cardset._id), learnable);
			LeitnerActivationDay.update({_id: leitnerActivationDay._id},
				{
					$set: {
						"bonusPoints.atEnd": bonusPoints
					}
				});
		}
	}

	/** Function returns the amount of cards inside a box that are valid to learn
	 *  @param {string} learning_phase_id - The id of the users active learning phase
	 *  @param {string} workload_id - The id of the users active workload
	 *  @param {string} cardset_id - The id of the cardset with active learners
	 *  @param {string} user_id - The id of the user
	 *  @param {number} box - The box that contains the card
	 *  @returns {number} - The amount of valid cards inside the selected box
	 * */
	static getCardCount (learning_phase_id, workload_id, cardset_id, user_id, box) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return LeitnerUserCardStats.find({
				learning_phase_id: learning_phase_id,
				workload_id: workload_id,
				cardset_id: cardset_id,
				user_id: user_id,
				box: box,
				isActive: false,
				nextPossibleActivationDate: {$lte: new Date()}
			}).count();
		}
	}

	/** Function checks if there are any cards left to learn for a user
	 *  @returns {number} - The total amount of valid cards to learn
	 * */
	static noCardsLeft (cardCount) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return cardCount.reduce(function (prev, cur) {
				return prev + cur;
			});
		}
	}

	/** Resets the Leitner data to default values (For an inactive learning-phase).
	 *  @param {Object} cardset - The cardset for which we reset the leitner data
	 *  @returns {Object} - cardset with updated values
	 * */
	static defaultCardsetLeitnerData (cardset) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (cardset.learningActive === false) {
				let endDate = (new Date().setFullYear(2038, 0, 19));
				Cardsets.update(cardset._id, {
					$set: {
						maxCards: bonusFormConfig.defaultMaxWorkload,
						daysBeforeReset: bonusFormConfig.defaultDaysBeforeReset,
						learningStart: cardset.date,
						learningEnd: endDate,
						learningInterval: bonusFormConfig.defaultIntervals,
						registrationPeriod: endDate
					}
				});
				return Cardsets.findOne({_id: cardset._id});
			} else {
				return cardset;
			}
		}
	}

	/** Adds new cards to the learners list for leitner box mode
	 *  @param {string} cardset - The cardset in which the user is learning
	 *  @param {string} user_id - The id of the user who is currently learning in the specific cardset
	 *  @returns {Boolean} - Return true once the task is completed
	 * */
	static addLeitnerCards (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let isNewcomer = true;
			if (!Bonus.isInBonus(cardset._id, user_id)) {
				let learningWorkload = LeitnerLearningWorkload.findOne({cardset_id: cardset._id, user_id: user_id, isActive: true, isBonus: false});
				if (learningWorkload === undefined) {
					Meteor.call('initializePrivateLearningPhase', cardset._id, user_id);
				}
			}
			let cards;
			let cardsetFilter = [cardset._id];
			if (cardset.shuffled) {
				cardsetFilter = cardset.cardGroups;
			}
			let cardsetsWithLearningMode = [];
			let result;
			for (let i = 0; i < cardsetFilter.length; i++) {
				result = Cardsets.findOne({
					_id: cardsetFilter[i],
					cardType: {$in: CardType.getCardTypesWithLearningModes()}
				});
				if (result !== undefined) {
					cardsetsWithLearningMode.push(cardsetFilter[i]);
				}
			}
			let letActiveLeitnerWorkload = LeitnerLearningWorkload.findOne({cardset_id: cardset._id, user_id: user_id, isActive: true});
			let excludedCards = LeitnerUserCardStats.find({
				cardset_id: cardset._id,
				user_id: user_id,
				learning_phase_id: letActiveLeitnerWorkload.learning_phase_id,
				workload_id: letActiveLeitnerWorkload._id
			}, {fields: {card_id: 1}}).fetch().map(function (card) {
				return card.card_id;
			});

			if (LeitnerUserCardStats.findOne({
				user_id: user_id,
				cardset_id: cardset._id,
				learning_phase_id: letActiveLeitnerWorkload.learning_phase_id,
				workload_id: letActiveLeitnerWorkload._id
			}) !== undefined) {
				isNewcomer = false;
			}
			let newItems = [];
			let newItemObject;
			let nextPossibleActivationDate = new Date();
			cards = Cards.find({
				_id: {$nin: excludedCards},
				cardset_id: {$in: cardsetsWithLearningMode}
			}, {fields: {_id: 1, cardset_id: 1}}).fetch();
			cards.forEach(function (card) {
				newItemObject = {
					learning_phase_id: letActiveLeitnerWorkload.learning_phase_id,
					workload_id: letActiveLeitnerWorkload._id,
					card_id: card._id,
					cardset_id: cardset._id,
					user_id: user_id,
					box: 1,
					isActive: false,
					submittedAnswer: false,
					nextPossibleActivationDate: nextPossibleActivationDate,
					activatedSinceDate: nextPossibleActivationDate,
					skipped: 0,
					priority: 0,
					viewedPDF: false,
					stats: {
						answers: {
							known: 0,
							notKnown: 0,
							skipped: 0
						},
						workingTime: {
							sum: 0,
							median: 0,
							arithmeticMean: 0,
							standardDeviation: 0
						}
					},
					assignedCounter: 0
				};
				if (cardset.shuffled) {
					newItemObject.original_cardset_id = card.cardset_id;
				}
				newItems.push(newItemObject);
			});
			if (newItems.length > 0) {
				LeitnerUserCardStats.batchInsert(newItems);
			}
			Meteor.call("updateLearnerCount", cardset._id);
			Meteor.call('updateWorkloadCount', user_id);
			return isNewcomer;
		}
	}

	/** Function selects the next valid cards to learn and notifies the user
	 * 	@param {Object} leitnerLearningPhase - The active learning phase
	 * 	@param {Object} leitnerLearningWorkload - The active learning workload
	 *  @param {Object} cardset - The cardset with active learners
	 *  @param {Object} user - The user from the cardset who is currently learning
	 *  @param {boolean} isReset - Sends a special notification if the card selection got called by missing the deadline
	 *  @param {boolean} isNewcomer - Did the user just start learning?
	 * */
	static setCards (leitnerLearningPhase, leitnerLearningWorkload, cardset, user, isReset, isNewcomer = false) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Meteor.isServer && Meteor.settings.debug.leitner) {
				console.log(`===> Set new active cards for ${user._id}`);
			}
			let algorithm = this.getBoxAlgorithm();
			let cardCount = [];
			//Get all cards that the user can learn right now
			for (let i = 0; i < algorithm.length; i++) {
				cardCount[i] = this.getCardCount(leitnerLearningPhase._id, leitnerLearningWorkload._id, cardset._id, user._id, i + 1);
			}

			if (Meteor.isServer && Meteor.settings.debug.leitner) {
				console.log(`===> Box Card Count: [${cardCount}]`);
				console.log(`===> Maximum active cards: ${leitnerLearningPhase.maxCards}`);
			}

			if (this.noCardsLeft(cardCount) === 0) {
				return;
			}

			algorithm = this.adjustBoxAlgorithm(cardCount, algorithm);

			let boxActiveCardCap = this.setActiveCardCap(leitnerLearningPhase, algorithm);
			if (config.fillUpMissingCards) {
				boxActiveCardCap = this.fillUpMissingCards(boxActiveCardCap, cardCount);
			}

			let cardSelection = this.selectCardsByOrder(leitnerLearningPhase, leitnerLearningWorkload, cardset, boxActiveCardCap, algorithm, user);
			if (Meteor.isServer && Meteor.settings.debug.leitner) {
				console.log(`===> Active cards BEFORE update ${LeitnerUserCardStats.find({
					learning_phase_id: leitnerLearningPhase._id,
					workload_id: leitnerLearningWorkload._id,
					cardset_id: cardset._id,
					user_id: user._id,
					isActive: true}).count()}`);
			}
			LeitnerUserCardStats.update({
				learning_phase_id: leitnerLearningPhase._id,
				workload_id: leitnerLearningWorkload._id,
				cardset_id: cardset._id,
				user_id: user._id,
				card_id: {$in: cardSelection}
			}, {
				$set: {
					isActive: true,
					submittedAnswer: false,
					activatedSinceDate: new Date()
				},
				$inc: {
					assignedCounter: 1
				}
			}, {multi: true});
			if (Meteor.isServer && Meteor.settings.debug.leitner) {
				console.log(`===> Active cards AFTER update ${LeitnerUserCardStats.find({
					learning_phase_id: leitnerLearningPhase._id,
					workload_id: leitnerLearningWorkload._id,
					cardset_id: cardset._id,
					user_id: user._id,
					isActive: true}).count()}`);
			}

			this.updateLeitnerWorkload(cardset._id, user._id, leitnerLearningWorkload);
			let activation_day_id = this.updateLeitnerActivationDays(cardset._id, user._id, leitnerLearningPhase, leitnerLearningWorkload);
			this.setLeitnerPerformanceHistory(cardset, user._id, activation_day_id, cardSelection, leitnerLearningWorkload);
			let messageType = 0;
			if (isReset) {
				messageType = 2;
			}
			Meteor.call('prepareMail', cardset, user, messageType, isNewcomer, activation_day_id);
			Meteor.call('prepareWebpush', cardset, user, isNewcomer, activation_day_id, messageType);
		}
	}

	static setLeitnerPerformanceHistory (cardset, user_id, activation_day_id, cardSelection, leitnerLearningWorkload) {
		if (!Meteor.isServer) {
			user_id = Meteor.userId();
		}
		let leitner = LeitnerUserCardStats.find({
			learning_phase_id: leitnerLearningWorkload.learning_phase_id,
			workload_id: leitnerLearningWorkload._id,
			cardset_id: cardset._id,
			user_id: user_id,
			card_id: {$in: cardSelection}}
		).fetch();
		let newItems = [];
		let newItemObject;
		leitner.forEach(function (leitnerItem) {
			newItemObject = {
				learning_phase_id: leitnerLearningWorkload.learning_phase_id,
				workload_id: leitnerLearningWorkload._id,
				card_id: leitnerItem.card_id,
				cardset_id: cardset._id,
				user_id: user_id,
				activation_day_id: activation_day_id,
				box: leitnerItem.box,
				skipped: 0
			};
			if (cardset.shuffled) {
				newItemObject.original_cardset_id = leitnerItem.original_cardset_id;
			}
			newItems.push(newItemObject);
		});
		if (newItems.length > 0) {
			LeitnerPerformanceHistory.batchInsert(newItems);
		}
	}

	static updateLeitnerActivationDays (cardset_id, user_id, leitnerLearningPhase, leitnerLearningWorkload) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let user = Meteor.users.findOne({_id: user_id});
			let cardset = Cardsets.findOne(cardset_id);
			let obj = {
				learning_phase_id: leitnerLearningWorkload.learning_phase_id,
				workload_id: leitnerLearningWorkload._id,
				cardset_id: cardset_id,
				user_id: user_id,
				missedDeadline: false,
				resetDeadlineMode: config.resetDeadlineMode,
				wrongAnswerMode: config.wrongAnswerMode,
				notifications: {
					mail: {
						active: user.mailNotification,
						sent: false,
						address: user.email
					},
					web: {
						active: user.webNotification,
						sent: false
					}
				},
				daysBeforeReset: leitnerLearningPhase.daysBeforeReset,
				pomodoroTimer: leitnerLearningPhase.pomodoroTimer,
				strictWorkloadTimer: leitnerLearningPhase.strictWorkloadTimer,
				timer: {
					workload: {
						current: 0,
						completed: 0
					},
					break: {
						current: 0,
						completed: 0
					},
					status: 0
				},
				performanceStats: {
					answerTime: {
						meidan: 0,
						arithmeticMean: 0,
						standardDeviation: 0
					},
					workingTime: {
						sum: 0
					}
				},
				createdAt: new Date()
			};
			if (leitnerLearningWorkload.isBonus) {
				let learnable = 0;
				let box6 = 0;
				LeitnerUserCardStats.find({
						cardset_id: cardset_id,
						user_id: user_id
					},
					{
						fields: {_id: 0, box: 1}
					})
					.forEach(elem => {
						learnable++;
						if (elem.box === 6) {
							box6++;
						}
					});
				const bonusPoints = Bonus.getAchievedBonus(box6, LeitnerLearningPhaseUtilities.getActiveBonus(cardset._id), learnable);
				obj.bonusPoints = {
					atStart: bonusPoints,
					atEnd: bonusPoints
				};
			}
			return LeitnerActivationDay.insert(obj);
		}
	}

	static getBoxAlgorithm () {
		return Array.from(config.boxAlgorithm);
	}

	static adjustBoxAlgorithm (cardCount, algorithm) {
		//Check the card counter of each Box in reverse and if empty, summate its percentage to the next box with cards
		for (let i = algorithm.length; i > 0; i--) {
			if (cardCount[i] === 0 && i - 1 >= 0) {
				algorithm[i - 1] += algorithm[i];
				algorithm[i] = 0;
			}
		}
		//Scale all percentage values of boxes with cards to fill 100%
		if (cardCount[0] === 0) {
			for (let i = 0; i < algorithm.length; i++) {
				if (cardCount[i] !== 0) {
					algorithm[i] = algorithm[i] * (1 / (1 - algorithm[0]));
				}
			}
			algorithm[0] = 0;
		}
		return algorithm;
	}

	static setActiveCardCap (leitnerLearningPhase, algorithm) {
		let boxActiveCardCap = [];
		for (let i = 0; i < algorithm.length; i++) {
			boxActiveCardCap.push(Math.round(leitnerLearningPhase.maxCards * algorithm[i]));
		}
		//Make sure that the rounded values don't go over the cap
		let sum = 0;
		for (let i = 0; i < boxActiveCardCap.length; i++) {
			sum += boxActiveCardCap[i];
		}
		if (sum > leitnerLearningPhase.maxCards) {
			let removeCardCount = sum - leitnerLearningPhase.maxCards;
			for (let i = 0; i < removeCardCount; i++) {
				for (let k = boxActiveCardCap.length; k > 0; k--) {
					if (removeCardCount > 0 && boxActiveCardCap[k] > 0) {
						if (boxActiveCardCap[k] >= removeCardCount) {
							boxActiveCardCap[k] -= removeCardCount;
							removeCardCount = 0;
						} else {
							removeCardCount -= boxActiveCardCap[k];
							boxActiveCardCap[k] = 0;
						}
					}
				}
			}
		}
		// Adjust the algorithm values to fill as many slots as possible
		if (Meteor.isServer && Meteor.settings.debug.leitner) {
			console.log("===> Active Card cap for each box before adjustments: [" + boxActiveCardCap + "]");
		}
		return boxActiveCardCap;
	}

	static fillUpMissingCards (boxActiveCardCap, cardCount) {
		let missingCardCount = [];
		for (let i = 0; i < boxActiveCardCap.length; i++) {
			if (boxActiveCardCap[i] !== 0 && cardCount[i] !== 0) {
				missingCardCount.push(-(cardCount[i] - boxActiveCardCap[i]));
			} else {
				missingCardCount.push(0);
			}
		}
		if (Meteor.isServer && Meteor.settings.debug.leitner) {
			console.log("===> Missing Cards: [" + missingCardCount + "]");
		}
		let missingCardsSum = 0;
		for (let i = 0; i < missingCardCount.length; i++) {
			if (missingCardCount[i] > 0) {
				boxActiveCardCap[i] -= (missingCardCount[i]);
				missingCardsSum += missingCardCount[i];
			}
		}
		if (Meteor.isServer && Meteor.settings.debug.leitner) {
			console.log("===> Sum of missing cards: " + missingCardsSum);
		}
		let fillUpCount = 0;
		if (!config.fillUpFromLeftToRight) {
			boxActiveCardCap.reverse();
			missingCardCount.reverse();
		}
		for (let i = 0; i < missingCardCount.length; i++) {
			if (missingCardsSum > 0 && missingCardCount[i] < 0) {
				if (missingCardsSum > (-missingCardCount[i])) {
					fillUpCount = (-missingCardCount[i]);
				} else {
					fillUpCount = missingCardsSum;
				}
				boxActiveCardCap[i] += fillUpCount;
				missingCardsSum -= fillUpCount;
			}
		}
		if (!config.fillUpFromLeftToRight) {
			boxActiveCardCap.reverse();
		}
		return boxActiveCardCap;
	}

	static selectCardsByOrder (leitnerLearningPhase, leitnerLearningWorkload, cardset, boxActiveCardCap, algorithm, user) {
		let nextCards = [];
		CardIndex.initializeIndex(cardset);
		let index = CardIndex.getCardIndex();
		//Get all cards from a box that match the leitner criteria
		for (let l = 0; l < algorithm.length; l++) {
			let leitnerCards = LeitnerUserCardStats.find({
				learning_phase_id: leitnerLearningPhase._id,
				workload_id: leitnerLearningWorkload._id,
				cardset_id: cardset._id,
				user_id: user._id,
				box: (l + 1),
				isActive: false,
				nextPossibleActivationDate: {$lte: new Date()}
			}, {fields: {card_id: 1, priority: 1}}).fetch();
			let filter = Utilities.getUniqData(leitnerCards, 'card_id');
			let priorities = Utilities.getUniqData(leitnerCards, 'priority');
			priorities = priorities.sort(function (a,b) {
				return a - b;
			});
			priorities.reverse();
			let sortedCards = [];
			let activeCardCap = boxActiveCardCap[l];
			let foundCardCount = 0;
			for (let p = 0; p < priorities.length; p++) {
				if (foundCardCount === activeCardCap) {
					break;
				}
				for (let i = 0; i < index.length; i++) {
					if (foundCardCount === activeCardCap) {
						break;
					}
					if (filter.indexOf(index[i]) > -1) {
						if (gotPriority(leitnerCards, index[i], priorities[p])) {
							sortedCards.push(index[i]);
							foundCardCount++;
						}
					}
				}
			}
			if (sortedCards.length) {
				for (let c = 0; c < activeCardCap; c++) {
					if (sortedCards[c] !== "" && sortedCards[c] !== undefined) {
						nextCards.push(sortedCards[c]);
					}
				}
			}
		}
		if (Meteor.settings.debug.leitner && Meteor.isServer) {
			console.log(`===> Active Card cap for each box after adjustments: [${boxActiveCardCap}]`);
			console.log(`===> ${nextCards.length} new active Cards: [${nextCards}]`);
		}
		return nextCards;
	}

	/** Function resets all active cards to their previous box
	 *  @param {Object} learningPhase - The active learning phase
	 *  @param {Object} workload - The active workload of the selected user
	 *  @param {Object} cardset - The cardset of the learning phase
	 *  @param {Object} user - The user from the cardset who is currently learning
	 * */
	static resetCards (learningPhase, workload, cardset, user) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Meteor.settings.debug.leitner) {
				console.log("===> Reset cards");
			}
			let query = {
				learning_phase_id: workload.learning_phase_id,
				workload: workload._id,
				cardset_id: workload.cardset_id,
				user_id: user._id,
				box: {$ne: 6}
			};
			if (config.resetDeadlineMode === 0 || config.resetDeadlineMode === 1 || config.resetDeadlineMode === 4) {
				query.isActive = true;
			}
			let idArray;
			if (config.resetDeadlineMode === 0 || config.resetDeadlineMode === 2 || config.resetDeadlineMode === 4) {
				let box;
				for (let i = 1; i < 6; i++) {
					if (config.resetDeadlineMode === 4) {
						box = i;
					} else {
						if (i > 1) {
							box = i - 1;
						} else {
							box = 1;
						}
					}
					query.box = i;
					let cards = LeitnerUserCardStats.find(query, {
						fields: {
							card_id: 1
						}
					}).fetch();
					idArray = _.pluck(cards, "card_id");
					if (Meteor.settings.debug.leitner) {
						console.log(`===> Resetting ${idArray.length} cards [${idArray}]`);
					}
					LeitnerUserCardStats.update({
						card_id: {$in: idArray},
						learning_phase_id: workload.learning_phase_id,
						workload: workload._id,
						cardset_id: workload.cardset_id,
						user_id: user._id
					}, {
						$set: {
							box: box,
							isActive: false,
							nextPossibleActivationDate: new Date(),
							activatedSinceDate: new Date(),
							skipped: 0
						}
					}, {multi: true});
					if (Meteor.settings.debug.leitner) {
						console.log(`===> ${LeitnerUserCardStats.find({
							learning_phase_id: workload.learning_phase_id,
							workload: workload._id,
							cardset_id: workload.cardset_id,
							user_id: user._id,
							isActive: true}).count()} active Cards left after reset\n`);
					}
					let latestActivationDate = LeitnerActivationDay.findOne({
						learning_phase_id: workload.learning_phase_id,
						workload: workload._id,
						cardset_id: workload.cardset_id,
						user_id: user._id
					}, {$sort: {createdAt: -1}});
					LeitnerActivationDay.update({
						_id: latestActivationDate._id
					}, {
						$set: {
							missedDeadline: true,
							resetDeadlineMode: config.resetDeadlineMode,
							wrongAnswerMode: config.wrongAnswerMode
						}
					});
					LeitnerPerformanceHistory.update({
						card_id: {$in: idArray},
						learning_phase_id: workload.learning_phase_id,
						workload: workload._id,
						cardset_id: workload.cardset_id,
						user_id: user._id,
						activation_day_id: latestActivationDate._id
					}, {
						$set: {
							box: box
						}
					}, {multi: true});
				}
			} else {
				let cards = LeitnerUserCardStats.find(query, {
					fields: {
						card_id: 1
					}
				}).fetch();
				idArray = _.pluck(cards, "card_id");
				if (Meteor.settings.debug.leitner) {
					console.log(`===> Resetting ${idArray.length} cards [${idArray}]`);
				}
				LeitnerUserCardStats.update({
					card_id: {$in: idArray},
					learning_phase_id: workload.learning_phase_id,
					workload: workload._id,
					cardset_id: workload.cardset_id,
					user_id: user._id
				}, {
					$set: {
						box: 1,
						isActive: false,
						nextPossibleActivationDate: new Date(),
						activatedSinceDate: new Date(),
						skipped: 0
					}
				}, {multi: true});
				if (Meteor.settings.debug.leitner) {
					console.log(`===> ${LeitnerUserCardStats.find({
						learning_phase_id: workload.learning_phase_id,
						workload: workload._id,
						cardset_id: workload.cardset_id,
						user_id: user._id,
						isActive: true
					}).count()} active Cards left after reset\n`);
				}
				let latestActivationDate = LeitnerActivationDay.findOne({
					learning_phase_id: workload.learning_phase_id,
					workload: workload._id,
					cardset_id: workload.cardset_id,
					user_id: user._id
				}, {$sort: {createdAt: -1}});
				LeitnerActivationDay.update({
					_id: latestActivationDate._id
				}, {
					$set: {
						missedDeadline: true,
						resetDeadlineMode: config.resetDeadlineMode,
						wrongAnswerMode: config.wrongAnswerMode
					}
				});
				LeitnerPerformanceHistory.update({
					card_id: {$in: idArray},
					learning_phase_id: workload.learning_phase_id,
					workload: workload._id,
					cardset_id: workload.cardset_id,
					user_id: user._id,
					activation_day_id: latestActivationDate._id
				}, {
					$set: {
						box: 1
					}
				}, {multi: true});
			}
			this.setCards(learningPhase, workload, cardset, user, true);
		}
	}

	static updateLeitnerWorkload (cardset_id, user_id, leitnerLearningWorkload) {
		let nextLeitnerCardDate = new Date();
		let activeLeitnerCardDate = new Date();
		let learnedAllLeitnerCards = false;

		let activeLeitnerCards = LeitnerUserCardStats.find({
			learning_phase_id: leitnerLearningWorkload.learning_phase_id,
			workload_id: leitnerLearningWorkload._id,
			cardset_id: cardset_id,
			user_id: user_id,
			isActive: true}).count();

		let nextLeitnerObject = LeitnerUserCardStats.findOne({
			learning_phase_id: leitnerLearningWorkload.learning_phase_id,
			workload_id: leitnerLearningWorkload._id,
			cardset_id: cardset_id,
			user_id: user_id,
			box: {$ne: 6},
			isActive: false}, {sort: {nextPossibleActivationDate: 1}});
		if (nextLeitnerObject) {
			nextLeitnerCardDate = nextLeitnerObject.nextPossibleActivationDate;
		}

		let activeLeitnerObject = LeitnerUserCardStats.findOne({
			learning_phase_id: leitnerLearningWorkload.learning_phase_id,
			workload_id: leitnerLearningWorkload._id,
			cardset_id: cardset_id,
			user_id: user_id,
			box: {$ne: 6},
			isActive: true}, {sort: {activatedSinceDate: 1}});
		if (activeLeitnerObject) {
			activeLeitnerCardDate = activeLeitnerObject.activatedSinceDate;
		}

		if (!LeitnerUserCardStats.find({
			learning_phase_id: leitnerLearningWorkload.learning_phase_id,
			workload_id: leitnerLearningWorkload._id,
			cardset_id: cardset_id,
			user_id: user_id,
			box: {$ne: 6}}).count()) {
			learnedAllLeitnerCards = true;
		}
		LeitnerLearningWorkload.update({
			_id: leitnerLearningWorkload._id,
			cardset_id: cardset_id,
			user_id: user_id,
			isActive: true
		}, {
			$set: {
				activeCardCount: activeLeitnerCards,
				gotFinished: learnedAllLeitnerCards,
				nextActivationDate: nextLeitnerCardDate,
				activationDate: activeLeitnerCardDate,
				updatedAt: new Date()
			}
		});
	}

	static updateWorkTimer (leitnerActivationDay) {
		if (leitnerActivationDay.timer.lastCallback === undefined) {
			LeitnerActivationDay.update({
					_id: leitnerActivationDay._id
				},
				{
					$set: {
						'timer.lastCallback': new Date()
					}
				});
		} else {
			let status = 0;
			let remainingWorkTime = leitnerActivationDay.pomodoroTimer.workLength - ++leitnerActivationDay.timer.workload.current;
			if (remainingWorkTime === 0) {
				status = 1;
			}
			if (moment(moment()).diff(moment(leitnerActivationDay.timer.lastCallback), 'seconds') > minimumSecondThreshold) {
				LeitnerActivationDay.update({
						_id: leitnerActivationDay._id
					},
					{
						$set: {
							'timer.lastCallback': new Date(),
							'timer.status': status
						},
						$inc: {
							'timer.workload.current': 1
						}
					});
			}
		}
	}

	/** Function marks an active leitner card as learned
	 *  @param {boolean} isAnswerWrong - false = known, true = not known
	 *  @param {Object} activeLeitnerCard - The active Leitner object that's going to be updated
	 *  @param {Object} cardset - The cardset related to the activeLeitner object
	 *  @param {Object} leitnerLearningPhase - The leitner learning phase related to the activeLeitner object
	 *  @param {Object} leitnerLearningWorkload - The leitner learning workload related to the activeLeitner object
	 * */
	static setNextBoxData (isAnswerWrong, activeLeitnerCard, cardset, leitnerLearningPhase, leitnerLearningWorkload) {
		let box = activeLeitnerCard.box + 1;
		let nextDate = moment();
		let newPriority;
		let result = {};
		let cardType;

		if (cardset.shuffled) {
			let cardCardset = Cardsets.findOne({_id: activeLeitnerCard.original_cardset_id});
			cardType = cardCardset.cardType;
		} else {
			cardType = cardset.cardType;
		}

		if (isAnswerWrong) {
			if (config.wrongAnswerMode === 1) {
				if (activeLeitnerCard.box > 1) {
					box = activeLeitnerCard.box - 1;
				} else {
					box = 1;
				}
			} else {
				box = 1;
			}
		}

		let lowestPriority = leitnerLearningWorkload.nextLowestPriority;
		if (CardType.gotNonRepeatingLeitner(cardType) && !isAnswerWrong) {
			//Move to the last box if card Type got no repetition
			box = 6;
		} else {
			newPriority = lowestPriority[box - 1];
			lowestPriority[box - 1] = newPriority - 1;
		}

		if (box !== 6) {
			nextDate.add(leitnerLearningPhase.intervals[box - 1], 'days');
		}

		result.box = box;
		result.priority = newPriority;
		result.nextPossibleActivationDate = nextDate.toDate();
		result.lowestPriorityList = lowestPriority;
		return result;
	}

	static updateBreakTimer (leitnerTask) {
		if (moment(moment()).diff(moment(leitnerTask.timer.lastCallback), 'seconds') > minimumSecondThreshold) {
			let status = 2;
			let remainingWorkTime = PomodoroTimer.getCurrentBreakLength(leitnerTask) - ++leitnerTask.timer.break.current;
			if (remainingWorkTime === 0) {
				status = 3;
			}
			LeitnerActivationDay.update({
					_id: leitnerTask._id
				},
				{
					$set: {
						'timer.lastCallback': new Date(),
						'timer.status': status
					},
					$inc: {
						'timer.break.current': 1
					}
				});
		}
	}
};
