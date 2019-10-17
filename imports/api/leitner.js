import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Leitner, LeitnerHistory, Workload} from "./learned";
import {Cardsets} from "./cardsets";
import {Bonus} from "./bonus";
import {Profile} from "./profile";
import {UserPermissions} from "./permissions";
import {CardType} from "./cardTypes";
import {Cards} from "./cards";
import * as config from "../config/leitner.js";
import * as bonusFormConfig from "../config/bonusForm.js";
import {Utilities} from "./utilities";
import {CardIndex} from "./cardIndex";

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
	/** Function returns the amount of cards inside a box that are valid to learn
	 *  @param {string} cardset_id - The id of the cardset with active learners
	 *  @param {string} user_id - The id of the user
	 *  @param {number} box - The box that contains the card
	 *  @returns {number} - The amount of valid cards inside the selected box
	 * */
	static getCardCount (cardset_id, user_id, box) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Leitner.find({
				cardset_id: cardset_id,
				user_id: user_id,
				box: box,
				active: false,
				nextDate: {$lte: new Date()}
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
			Meteor.call('initializeWorkloadData', cardset._id, user_id);
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
			let existingItems = Leitner.find({
				cardset_id: cardset._id,
				user_id: user_id
			}, {fields: {card_id: 1}}).fetch();
			let excludedCards = [];
			existingItems.forEach(function (existingItem) {
				excludedCards.push(existingItem.card_id);
			});

			if (Leitner.findOne({user_id: user_id, cardset_id: cardset._id}) !== undefined) {
				isNewcomer = false;
			}
			let newItems = [];
			let newItemObject;
			let nextDate = new Date();
			cards = Cards.find({
				_id: {$nin: excludedCards},
				cardset_id: {$in: cardsetsWithLearningMode}
			}, {fields: {_id: 1, cardset_id: 1}}).fetch();
			cards.forEach(function (card) {
				newItemObject = {
					card_id: card._id,
					cardset_id: cardset._id,
					user_id: user_id,
					box: 1,
					active: false,
					nextDate: nextDate,
					currentDate: nextDate,
					skipped: 0,
					priority: 0
				};
				if (cardset.shuffled) {
					newItemObject.original_cardset_id = card.cardset_id;
				}
				newItems.push(newItemObject);
			});
			if (newItems.length > 0) {
				Leitner.batchInsert(newItems);
			}
			Meteor.call("updateLearnerCount", cardset._id);
			Meteor.call('updateWorkloadCount', user_id);
			return isNewcomer;
		}
	}

	/** Function selects the next valid cards to learn and notifies the user
	 *  @param {Object} cardset - The cardset with active learners
	 *  @param {Object} user - The user from the cardset who is currently learning
	 *  @param {boolean} isReset - Sends a special notification if the card selection got called by missing the deadline
	 *  @param {boolean} isNewcomer - Did the user just start learning?
	 * */
	static setCards (cardset, user, isReset, isNewcomer = false) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Meteor.isServer && Meteor.settings.debug.leitner) {
				console.log("===> Set new active cards for " + user._id);
			}
			let algorithm = this.getBoxAlgorithm();
			let cardCount = [];
			//Get all cards that the user can learn right now
			for (let i = 0; i < algorithm.length; i++) {
				cardCount[i] = this.getCardCount(cardset._id, user._id, i + 1);
			}

			if (Meteor.isServer && Meteor.settings.debug.leitner) {
				console.log("===> Box Card Count: [" + cardCount + "]");
				console.log("===> Maximum active cards: " + cardset.maxCards);
			}

			if (this.noCardsLeft(cardCount) === 0) {
				return;
			}

			algorithm = this.adjustBoxAlgorithm(cardCount, algorithm);

			let boxActiveCardCap = this.setActiveCardCap(cardset, algorithm);
			if (config.fillUpMissingCards) {
				boxActiveCardCap = this.fillUpMissingCards(boxActiveCardCap, cardCount);
			}

			let cardSelection = this.selectCardsByOrder(cardset, boxActiveCardCap, algorithm, user);

			Leitner.update({
				cardset_id: cardset._id,
				user_id: user._id,
				card_id: {$in: cardSelection}
			}, {
				$set: {
					active: true,
					currentDate: new Date()
				}
			}, {multi: true});
			this.updateLeitnerWorkload(cardset._id, user._id);
			let task_id = this.updateLeitnerWorkloadTasks(cardset._id, user._id);
			this.setLeitnerHistory(cardset, user._id, task_id, cardSelection);
			Meteor.call('prepareMail', cardset, user, isReset, isNewcomer);
			Meteor.call('prepareWebpush', cardset, user, isNewcomer);
		}
	}

	static setLeitnerHistory (cardset, user_id, task_id, cardSelection) {
		if (!Meteor.isServer) {
			user_id = Meteor.userId();
		}
		let leitner = Leitner.find({cardset_id: cardset._id, user_id: user_id, card_id: {$in: cardSelection}}).fetch();
		let newItems = [];
		let newItemObject;
		leitner.forEach(function (leitner) {
			newItemObject = {
				card_id: leitner.card_id,
				cardset_id: cardset._id,
				user_id: user_id,
				task_id: task_id,
				box: leitner.box
			};
			if (cardset.shuffled) {
				newItemObject.original_cardset_id = leitner.original_cardset_id;
			}
			newItems.push(newItemObject);
		});
		if (newItems.length > 0) {
			LeitnerHistory.batchInsert(newItems);
		}
	}

	static updateLeitnerWorkloadTasks (cardset_id, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let workload = Workload.findOne({cardset_id: cardset_id, user_id: user_id}, {fields: {leitner: 1}});
			if (workload.leitner.tasks === undefined) {
				let tasks = [];
				tasks.push(new Date());
				Workload.update({
					cardset_id: cardset_id,
					user_id: user_id
				}, {
					$set: {
						"leitner.tasks": tasks
					}
				});
			} else {
				Workload.update({
					cardset_id: cardset_id,
					user_id: user_id
				}, {
					$push: {
						"leitner.tasks": new Date()
					}
				});
			}
			workload = Workload.findOne({cardset_id: cardset_id, user_id: user_id}, {fields: {leitner: 1}});
			return workload.leitner.tasks.length - 1;
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

	static setActiveCardCap (cardset, algorithm) {
		let boxActiveCardCap = [];
		for (let i = 0; i < algorithm.length; i++) {
			boxActiveCardCap.push(Math.round(cardset.maxCards * algorithm[i]));
		}
		//Make sure that the rounded values don't go over the cap
		let sum = 0;
		for (let i = 0; i < boxActiveCardCap.length; i++) {
			sum += boxActiveCardCap[i];
		}
		if (sum > cardset.maxCards) {
			let removeCardCount = sum - cardset.maxCards;
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

	static selectCardsByOrder (cardset, boxActiveCardCap, algorithm, user) {
		let nextCards = [];
		CardIndex.initializeIndex(cardset);
		let index = CardIndex.getCardIndex();
		//Get all cards from a box that match the leitner criteria
		for (let l = 0; l < algorithm.length; l++) {
			let leitnerCards = Leitner.find({
				cardset_id: cardset._id,
				user_id: user._id,
				box: (l + 1),
				active: false,
				nextDate: {$lte: new Date()}
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
			console.log("===> Active Card cap for each box after adjustments: [" + boxActiveCardCap + "]");
			console.log("===> " + nextCards.length + " new active Cards: [" + nextCards + "]");
		}
		return nextCards;
	}

	/** Function resets all active cards to their previous box
	 *  @param {Object} cardset - The cardset with learners
	 *  @param {Object} user - The user from the cardset who is currently learning
	 * */
	static resetCards (cardset, user) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Meteor.settings.debug.leitner) {
				console.log("===> Reset cards");
			}
			let query = {cardset_id: cardset._id, user_id: user._id, box: {$ne: 6}};
			if (config.resetDeadlineMode === 0 || config.resetDeadlineMode === 1 || config.resetDeadlineMode === 4) {
				query.active = true;
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
					let cards = Leitner.find(query, {
						fields: {
							card_id: 1
						}
					}).fetch();
					idArray = _.pluck(cards, "card_id");
					Leitner.update({card_id: {$in: idArray}, cardset_id: cardset._id, user_id: user._id}, {
						$set: {
							box: box,
							active: false,
							nextDate: new Date(),
							currentDate: new Date(),
							skipped: 0
						}
					}, {multi: true});
				}
			} else {
				let cards = Leitner.find(query, {
					fields: {
						card_id: 1
					}
				}).fetch();
				idArray = _.pluck(cards, "card_id");
				Leitner.update({card_id: {$in: idArray}, cardset_id: cardset._id, user_id: user._id}, {
					$set: {
						box: 1,
						active: false,
						nextDate: new Date(),
						currentDate: new Date(),
						skipped: 0
					}
				}, {multi: true});
			}
			this.setCards(cardset, user, true);
		}
	}

	static updateLeitnerWorkload (cardset_id, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let activeLeitnerCards = 0;
			let nextLeitnerCardDate = new Date();
			let activeLeitnerCardDate = new Date();
			let learnedAllLeitnerCards = false;
			let nextLowestPriority = [-1, -1, -1, -1, -1];
			let isLearningLeitner = Leitner.findOne({cardset_id: cardset_id, user_id: user_id});
			if (isLearningLeitner) {
				activeLeitnerCards = Leitner.find({cardset_id: cardset_id, user_id: user_id, active: true}).count();
				let nextLeitnerObject = Leitner.findOne({cardset_id: cardset_id, user_id: user_id, box: {$ne: 6}, active: false}, {sort: {nextDate: 1}});
				if (nextLeitnerObject) {
					nextLeitnerCardDate = nextLeitnerObject.nextDate;
				}
				let activeLeitnerObject = Leitner.findOne({cardset_id: cardset_id, user_id: user_id, box: {$ne: 6}, active: true}, {sort: {currentDate: 1}});
				if (activeLeitnerObject) {
					activeLeitnerCardDate = activeLeitnerObject.currentDate;
				}
				if (!Leitner.find({cardset_id: cardset_id, user_id: user_id, box: {$ne: 6}}).count()) {
					learnedAllLeitnerCards = true;
				}
				let workload = Workload.findOne({cardset_id: cardset_id, user_id: user_id});
				if (workload !== undefined) {
					nextLowestPriority = workload.leitner.nextLowestPriority;
				}
			}
			Workload.update({
				cardset_id: cardset_id,
				user_id: user_id
			}, {
				$set: {
					"leitner.activeCount": activeLeitnerCards,
					"leitner.active": isLearningLeitner !== undefined,
					"leitner.finished": learnedAllLeitnerCards,
					"leitner.nextDate": nextLeitnerCardDate,
					"leitner.activeDate": activeLeitnerCardDate,
					"leitner.nextLowestPriority": nextLowestPriority
				}
			});
		}
	}
};

Meteor.methods({
	initializeWorkloadData: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let workload = Workload.findOne({user_id: user_id, cardset_id: cardset_id});
		if (workload === undefined) {
			Workload.insert({
				cardset_id: cardset_id,
				user_id: user_id,
				leitner: {
					bonus: false,
					nextLowestPriority: [-1, -1, -1, -1, -1]
				}
			});
		}
	},
	joinBonus: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1}});
		if (cardset !== undefined) {
			if (Bonus.canJoinBonus(cardset._id) && Profile.isCompleted(Meteor.user())) {
				Meteor.call('initializeWorkloadData', cardset._id, Meteor.userId());
				Meteor.call('deleteLeitner', cardset._id);
				Meteor.call('deleteWozniak', cardset._id);
				Workload.update({
						cardset_id: cardset._id,
						user_id: Meteor.userId()
					},
					{
						$set: {
							'leitner.bonus': true,
							'leitner.dateJoinedBonus': new Date()
						}
					}
				);
			}
		}
	},
	leaveBonus: function (cardset_id) {
		check(cardset_id, String);
		let workload = Workload.findOne({user_id: Meteor.userId(), cardset_id: cardset_id}, {
			fields: {
				_id: 1,
				user_id: 1,
				cardset_id: 1
			}
		});
		if (workload !== undefined) {
			Workload.update({
					cardset_id: workload.cardset_id,
					user_id: Meteor.userId()
				},
				{
					$set: {
						'leitner.bonus': false
					}
				}
			);
		}
		Meteor.call('deleteLeitner', cardset_id);
	},
	/** Function adds a new user as learning
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @param {boolean} true - Process of adding the user to leitner ended successfully
	 * */
	addToLeitner: function (cardset_id) {
		check(cardset_id, String);
		if (Meteor.isServer) {
			if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked') || !UserPermissions.hasCardsetPermission(cardset_id)) {
				throw new Meteor.Error("not-authorized");
			} else {
				let cardset = Cardsets.findOne({_id: cardset_id});
				if (cardset !== undefined) {
					if (cardset.shuffled) {
						let counter = 0;
						for (let i = 0; i < cardset.cardGroups.length; i++) {
							if (CardType.gotLearningModes(Cardsets.findOne(cardset.cardGroups[i]).cardType)) {
								counter++;
							}
						}
						if (counter === 0) {
							throw new Meteor.Error("not-authorized");
						}
					} else {
						if (!CardType.gotLearningModes(cardset.cardType)) {
							throw new Meteor.Error("not-authorized");
						}
					}
					let isNewcomer = LeitnerUtilities.addLeitnerCards(cardset, Meteor.userId());
					cardset = LeitnerUtilities.defaultCardsetLeitnerData(cardset);
					if (isNewcomer && (!Bonus.isInBonus(cardset._id, Meteor.userId()) || cardset.learningEnd.getTime() > new Date().getTime())) {
						LeitnerUtilities.setCards(cardset, Meteor.user(), false, isNewcomer);
					}
				}
			}
		}
	},
	updateLeitnerCardIndex: function (cardset_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1}});
			let activeLearners = Leitner.find({cardset_id: cardset._id}, {fields: {user_id: 1}}).fetch();
			activeLearners = _.uniq(activeLearners, false, function (d) {
				return d.user_id;
			});
			for (let i = 0; i < activeLearners.length; i++) {
				LeitnerUtilities.addLeitnerCards(cardset, activeLearners[i].user_id);
			}
		}
	}
});
