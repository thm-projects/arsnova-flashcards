import {Meteor} from "meteor/meteor";
import {Cards} from "./subscriptions/cards.js";
import {TranscriptBonus} from "./subscriptions/transcriptBonus";
import {TranscriptBonusList} from "./transcriptBonus.js";
import {Leitner} from "./subscriptions/leitner";
import {Workload} from "./subscriptions/workload";
import {Wozniak} from "./subscriptions/wozniak";
import {Notifications} from "./subscriptions/notifications";
import {Ratings} from "./subscriptions/ratings";
import {check} from "meteor/check";
import {CardType} from "./cardTypes";
import {UserPermissions} from "./permissions";
import {ServerStyle} from "./styles";
import {Utilities} from "./utilities";
import {Cardsets} from "./subscriptions/cardsets.js";

Meteor.methods({
	getSearchCategoriesResult: function (searchValue, filterType) {
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin() && searchValue !== undefined && searchValue !== null && searchValue.length > 2) {
			let query = {};
			query.name = {$regex: searchValue, $options: "i"};
			switch (filterType) {
				case 0:
					if (UserPermissions.isAdmin()) {
						query.kind = {$nin: ['demo', 'server']};
					} else {
						if (this.userId) {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
							}
						} else {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
							}
						}
					}
					query.shuffled = false;
					break;
				case 1:
					if (this.userId) {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
						}
					} else {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
						}
					}
					query.shuffled = false;
					break;
				case 2:
					if (this.userId) {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
						}
					} else {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
						}
					}
					query.shuffled = true;
					break;
				case 3:
					query.owner = Meteor.userId();
					query.shuffled = false;
					break;
				case 4:
					if (UserPermissions.isAdmin()) {
						query.kind = {$nin: ['demo', 'server']};
					} else {
						if (this.userId) {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
							}
						} else {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
							}
						}
					}
					query.shuffled = true;
					break;
				case 5:
					query.owner = Meteor.userId();
					query.shuffled = true;
					break;
				case 6:
					if (UserPermissions.isAdmin()) {
						query.kind = {$nin: ['demo', 'server']};
					} else {
						if (this.userId) {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.$or = [{kind: {$nin: ['demo', 'server', 'personal']}}, {owner: Meteor.userId()}];
							} else {
								query.$or = [{kind: {$nin: ['demo', 'pro', 'server', 'personal']}}, {owner: Meteor.userId()}];
							}
						} else {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.$or = [{kind: {$nin: ['demo', 'edu', 'server', 'personal']}}, {owner: Meteor.userId()}];
							} else {
								query.$or = [{kind: {$nin: ['demo', 'pro', 'edu', 'server', 'personal']}}, {owner: Meteor.userId()}];
							}
						}
					}
					query.shuffled = false;
					break;
			}
			let results = Cardsets.find(query, {fields: {_id: 1}}).fetch();
			let filter = [];
			if (results !== undefined) {
				for (let i = 0; i < results.length; i++) {
					filter.push(results[i]._id);
				}
				return Cardsets.find({_id: {$in: filter}}, {
					fields: {
						_id: 1,
						name: 1,
						owner: 1,
						description: 1,
						kind: 1,
						shuffled: 1,
						quantity: 1,
						cardType: 1,
						difficulty: 1,
						learningActive: 1,
						transcriptBonus: 1,
						wordcloud: 1,
						lecturerAuthorized: 1
					}
				}).fetch();
			}
		} else {
			return [];
		}
	},
	/**
	 * Adds a cardset to the personal deck of cards.
	 * @param {String} name - Title of the cardset
	 * @param {String} description - Description for the content of the cardset
	 * @param {Boolean} visible - Visibility of the cardset
	 * @param {Boolean} ratings - Rating of the cardset
	 * @param {String} kind - Type of cards
	 * @param {Boolean} shuffled - Is the cardset made out of shuffled cards
	 * @param {String} cardGroups - The group names of the shuffled cards
	 * @param {Number} cardType - The type that this cardset allows
	 * @param {Number} difficulty - The difficulty level of the cardset
	 * @param {Number} sortType - Sort the topic content by card content or date created, 0 = content, 1 = date created
	 */
	addCardset: function (name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType) {
		check(name, String);
		check(description, String);
		check(visible, Boolean);
		check(ratings, Boolean);
		check(kind, String);
		check(shuffled, Boolean);
		check(cardType, Number);
		check(difficulty, Number);
		check(sortType, Number);
		let quantity;
		let gotWorkload;
		if (shuffled) {
			if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'lecturer', 'university', 'pro'])) {
				throw new Meteor.Error("not-authorized");
			}
			check(cardGroups, [String]);
			quantity = Cards.find({cardset_id: {$in: cardGroups}}).count();
			gotWorkload = false;
		} else {
			quantity = 0;
			cardGroups = [];
			gotWorkload = CardType.getCardTypesWithLearningModes().includes(cardType);
		}
		// Make sure the user is logged in before inserting a cardset
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (cardType < 0) {
			cardType = 0;
		}
		if (CardType.gotTranscriptBonus(cardType)) {
			if (UserPermissions.isLecturer() || UserPermissions.isAdmin()) {
				kind = "edu";
				visible = true;
			} else {
				throw new Meteor.Error("not-authorized");
			}
		}
		let cardset = Cardsets.insert({
			name: name.trim(),
			description: description,
			date: new Date(),
			dateUpdated: new Date(),
			editors: [],
			owner: Meteor.userId(),
			visible: visible,
			ratings: ratings,
			kind: kind,
			price: 0,
			reviewed: false,
			reviewer: 'undefined',
			request: false,
			rating: 0,
			raterCount: 0,
			quantity: quantity,
			license: [],
			userDeleted: false,
			learningActive: false,
			maxCards: 0,
			daysBeforeReset: 0,
			learningStart: 0,
			learningEnd: 0,
			registrationPeriod: 0,
			learningInterval: [],
			mailNotification: true,
			webNotification: true,
			wordcloud: false,
			shuffled: shuffled,
			cardGroups: cardGroups,
			cardType: cardType,
			difficulty: difficulty,
			noDifficulty: !CardType.gotDifficultyLevel(cardType),
			sortType: sortType,
			gotWorkload: gotWorkload,
			lastEditor: Meteor.userId()
		}, {trimStrings: false});
		Meteor.call('updateCardsetCount', Meteor.userId());
		return cardset;
	},
	/**
	 * Delete selected Cardset from database if user is auhorized.
	 * @param {String} id - Database id of the cardset to be deleted
	 */
	deleteCardset: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.remove(id);
			Cards.remove({
				cardset_id: id
			});
			Meteor.call('updateShuffledCardsetQuantity', id);
			Leitner.remove({
				cardset_id: id
			});
			Wozniak.remove({
				cardset_id: id
			});
			Notifications.remove({
				link_id: id
			});
			Ratings.remove({
				cardset_id: id
			});
			Workload.remove({
				cardset_id: id
			});
			TranscriptBonus.remove({
				cardset_id: id
			});
			Meteor.call('updateCardsetCount', Meteor.userId());
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	deleteCards: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cards.remove({
				cardset_id: id
			});
			if (CardType.gotTranscriptBonus(cardset.cardType)) {
				Cardsets.update({
						_id: id
					},
					{
						$set: {
							quantity: 0
						}
					}
				);
			} else {
				Cardsets.update({
						_id: id
					},
					{
						$set: {
							quantity: 0,
							kind: 'personal',
							reviewed: false,
							request: false,
							visible: false,
							dateUpdated: new Date(),
							lastEditor: Meteor.userId()
						}
					}
				);
			}

			Meteor.call('updateShuffledCardsetQuantity', cardset._id);
			Leitner.remove({
				cardset_id: id
			});
			Wozniak.remove({
				cardset_id: id
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Deactivate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be deactivated.
	 */
	deactivateBonus: function (id) {
		check(id, String);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && cardset.learningActive && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			Cardsets.update(id, {
				$set: {
					learningActive: false,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			let users = Workload.find({
				cardset_id: cardset._id,
				'leitner.bonus': true
			}, {fields: {user_id: 1}}).fetch();
			for (let i = 0; i < users.length; i++) {
				Workload.update({
						cardset_id: cardset._id,
						user_id: users[i].user_id
					},
					{
						$set: {
							'leitner.bonus': false
						}
					}
				);
				Leitner.remove({
					cardset_id: cardset._id,
					user_id: users[i].user_id
				});
				Wozniak.remove({
					cardset_id: cardset._id,
					user_id: users[i].user_id
				});
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Activate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {Number} maxWorkload - Maximum number of daily learnable cards
	 * @param {Number} daysBeforeReset - Maximum overrun in days
	 * @param {Date} dateStart - Start date of the learnin gphase
	 * @param {Date} dateEnd - End date of the learning phase
	 * @param {Number} intervals - Learning interval in days
	 * @param {Date} registrationPeriod - Period in which new users can join the bonus phase
	 * @param {Number} maxBonusPoints - The maximum achieveable bonus points
	 * @param {Number} pomodoroTimerQuantity - The amount of pomodoro runs for bonus users
	 * @param {Number} pomodoroTimerWorkLength - How many minutes are bonus users supposed to work
	 * @param {Number} pomodoroTimerBreakLength - How long is the break
	 * @param {boolean} pomodoroTimerSoundConfig - Which sounds are enabled
	 * @param {Number} errorCount - Number in percent for not known cards of a simulation
	 * @param {Number} minLearned - The minimum amount of cards that the user has to learn (box 6) to receive the max bonus in %
	 */
	activateBonus: function (id, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod, maxBonusPoints, pomodoroTimerQuantity, pomodoroTimerWorkLength, pomodoroTimerBreakLength, pomodoroTimerSoundConfig, errorCount, minLearned) {
		check(id, String);
		check(maxWorkload, Number);
		check(daysBeforeReset, Number);
		check(dateStart, Date);
		check(dateEnd, Date);
		check(intervals, [Number]);
		check(registrationPeriod, Date);
		check(maxBonusPoints, Number);
		check(pomodoroTimerQuantity, Number);
		check(pomodoroTimerWorkLength, Number);
		check(pomodoroTimerBreakLength, Number);
		check(pomodoroTimerSoundConfig, [Boolean]);
		check(errorCount, [[Number]]);
		check(minLearned, Number);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && !cardset.learningActive && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			intervals = intervals.sort(
				function (a, b) {
					return a - b;
				}
			);
			Cardsets.update(id, {
				$set: {
					learningActive: true,
					maxCards: maxWorkload,
					daysBeforeReset: daysBeforeReset,
					learningStart: dateStart,
					learningEnd: dateEnd,
					learningInterval: intervals,
					registrationPeriod: registrationPeriod,
					"workload.bonus.maxPoints": Math.floor(maxBonusPoints),
					'pomodoroTimer.quantity': pomodoroTimerQuantity,
					'pomodoroTimer.workLength': pomodoroTimerWorkLength,
					'pomodoroTimer.breakLength': pomodoroTimerBreakLength,
					'pomodoroTimer.soundConfig': pomodoroTimerSoundConfig,
					'workload.simulator.errorCount': errorCount,
					'workload.bonus.minLearned': minLearned,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {Number} maxWorkload - Maximum number of daily learnable cards
	 * @param {Number} daysBeforeReset - Maximum overrun in days
	 * @param {Date} dateStart - Start date of the learnin gphase
	 * @param {Date} dateEnd - End date of the learning phase
	 * @param {Number} intervals - Learning interval in days
	 * @param {Date} registrationPeriod - Period in which new users can join the bonus phase
	 * @param {Number} maxBonusPoints - The maximum achieveable bonus points
	 * @param {Number} pomodoroTimerQuantity - The amount of pomodoro runs for bonus users
	 * @param {Number} pomodoroTimerWorkLength - How many minutes are bonus users supposed to work
	 * @param {Number} pomodoroTimerBreakLength - How long is the break
	 * @param {boolean} pomodoroTimerSoundConfig - Which sounds are enabled
	 * @param {Number} errorCount - Number in percent for not known cards of a simulation
	 * @param {Number} minLearned - The minimum amount of cards that the user has to learn (box 6) to receive the max bonus in %
	 */
	updateBonus: function (id, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod, maxBonusPoints, pomodoroTimerQuantity, pomodoroTimerWorkLength, pomodoroTimerBreakLength, pomodoroTimerSoundConfig, errorCount, minLearned) {
		check(id, String);
		check(maxWorkload, Number);
		check(daysBeforeReset, Number);
		check(dateStart, Date);
		check(dateEnd, Date);
		check(intervals, [Number]);
		check(registrationPeriod, Date);
		check(maxBonusPoints, Number);
		check(pomodoroTimerQuantity, Number);
		check(pomodoroTimerWorkLength, Number);
		check(pomodoroTimerBreakLength, Number);
		check(pomodoroTimerSoundConfig, [Boolean]);
		check(errorCount, [[Number]]);
		check(minLearned, Number);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && cardset.learningActive && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			intervals = intervals.sort(
				function (a, b) {
					return a - b;
				}
			);
			Cardsets.update(id, {
				$set: {
					maxCards: maxWorkload,
					daysBeforeReset: daysBeforeReset,
					learningStart: dateStart,
					learningEnd: dateEnd,
					learningInterval: intervals,
					registrationPeriod: registrationPeriod,
					"workload.bonus.maxPoints": Math.floor(maxBonusPoints),
					'pomodoroTimer.quantity': pomodoroTimerQuantity,
					'pomodoroTimer.workLength': pomodoroTimerWorkLength,
					'pomodoroTimer.breakLength': pomodoroTimerBreakLength,
					'pomodoroTimer.soundConfig': pomodoroTimerSoundConfig,
					'workload.simulator.errorCount': errorCount,
					'workload.bonus.minLearned': minLearned,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a transcript bonus for the selected cardset.
	 * @param {String} id - ID of the cardset for which the transcript bonus is to be activated.
	 * @param {Number} isEnabled - Is the transcript bonus enabled?
	 * @param {Number} percentage - Percentage for maximum achievable bonus points
	 * @param {String} lectureEnd - Time at which the lectures end
	 * @param {Number} deadlineSubmission - Amount of hours that the student got time to submit their transcript
	 * @param {Number} deadlineEditing - Amount of hours that the student got time to edit their transcript
	 * @param {Object} newLectures - Dates at which the individual lectures take place
	 * @param {Number} minimumSubmissions - The minimum amount of submissions that are required to reach max points
	 * @param {Number} minimumStars - The minimum amount of stars that are required to reach max points
	 */
	updateCardsetTranscriptBonus: function (id, isEnabled, percentage, lectureEnd, deadlineSubmission, deadlineEditing, newLectures, minimumSubmissions, minimumStars) {
		check(id, String);
		check(isEnabled, Boolean);
		check(percentage, Number);
		check(lectureEnd, String);
		check(deadlineSubmission, Number);
		check(deadlineEditing, Number);
		check(newLectures, [Object]);
		check(minimumSubmissions, Number);
		check(minimumStars, Number);
		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			Cardsets.update(id, {
				$set: {
					'transcriptBonus.enabled': isEnabled,
					'transcriptBonus.percentage': percentage,
					'transcriptBonus.lectureEnd': lectureEnd,
					'transcriptBonus.lectures': newLectures,
					'transcriptBonus.deadline': deadlineSubmission,
					'transcriptBonus.deadlineEditing': deadlineEditing,
					'transcriptBonus.minimumSubmissions': minimumSubmissions,
					'transcriptBonus.minimumStars': minimumStars,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			TranscriptBonus.update({"cardset_id": id}, {
				$set: {
					"deadline": deadlineSubmission,
					"deadlineEditing": deadlineEditing
				}
			}, {multi: true});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a transcript bonus for the selected cardset.
	 * @param {String} id - ID of the cardset for which the transcript bonus is to be activated.
	 * @param {Object} newLectures - Dates at which the individual lectures take place
	 */
	updateCardsetTranscriptBonusLectures: function (id, newLectures) {
		check(id, String);
		check(newLectures, [Object]);
		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			for (let i = 0; i < newLectures.length; i++) {
				if (newLectures.title !== undefined && newLectures[i].title.length > TranscriptBonusList.getTranscriptLectureNameMaxLength) {
					throw new Meteor.Error("not-authorized");
				}
			}
			Cardsets.update(id, {
				$set: {
					'transcriptBonus.lectures': newLectures,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the selected cardset if user is authorized.
	 * @param {String} id - ID of the cardset to be updated
	 * @param {String} name - Title of the cardset
	 * @param {String} description - Description for the content of the cardset
	 * @param {Number} cardType - The type that this cardset allows
	 * @param {Number} difficulty - The difficulty level of the cardset
	 * @param {Number} sortType - Sort the topic content by card content or date created, 0 = content, 1 = date created
	 */
	updateCardset: function (id, name, description, cardType, difficulty, sortType) {
		check(id, String);
		check(name, String);
		check(description, String);
		check(cardType, Number);
		check(difficulty, Number);
		check(sortType, Number);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			if (cardset.learningActive) {
				cardType = cardset.cardType;
			}
			let kind = cardset.kind;
			let visible = cardset.visible;
			if (CardType.gotTranscriptBonus(cardType)) {
				if (UserPermissions.isLecturer() || UserPermissions.isAdmin()) {
					kind = "edu";
					visible = true;
				} else {
					throw new Meteor.Error("not-authorized");
				}
			}
			let gotWorkload;
			if (cardset.shuffled) {
				gotWorkload = cardset.gotWorkload;
			} else {
				gotWorkload = CardType.getCardTypesWithLearningModes().includes(cardType);
			}
			Cardsets.update(id, {
				$set: {
					name: name.trim(),
					description: description,
					dateUpdated: new Date(),
					cardType: cardType,
					difficulty: difficulty,
					kind: kind,
					visible: visible,
					noDifficulty: !CardType.gotDifficultyLevel(cardType),
					sortType: sortType,
					gotWorkload: gotWorkload,
					lastEditor: Meteor.userId()
				}
			}, {trimStrings: false});
			Cards.update({cardset_id: id}, {
				$set: {
					cardType: cardType
				}
			}, {trimStrings: false});
			Meteor.call('updateShuffledCardsetQuantity', cardset._id);
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Update the cardGroups of the shuffled cardset
	 * @param {String} id - Database id of the cardset to receive the updated cardGroups
	 * @param {String} cardGroups - The cardset references
	 * @param {String} removedCardsets - The previous cardset references that got removed
	 */
	updateShuffleGroups: function (id, cardGroups, removedCardsets) {
		check(id, String);
		check(cardGroups, [String]);
		check(removedCardsets, [String]);
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			let quantity = Cards.find({cardset_id: {$in: cardGroups}}).count();
			let kind = cardset.kind;
			let visible = cardset.visible;
			if (cardGroups.length === 0) {
				kind = "personal";
				visible = false;
			}
			Cardsets.update({
				_id: cardset._id
			}, {
				$set: {
					visible: visible,
					kind: kind,
					quantity: quantity,
					cardGroups: cardGroups,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			let removedCards = Cards.find({cardset_id: {$in: removedCardsets}}).fetch();
			for (let i = 0; i < removedCards.length; i++) {
				Leitner.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
				Wozniak.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
			}
			Meteor.call("updateLeitnerCardIndex", cardset._id);
			return true;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateShuffledCardsetQuantity: function (cardset_id) {
		check(cardset_id, String);
		if (Meteor.isServer) {
			let cardsets = Cardsets.find({shuffled: true, cardGroups: {$in: [cardset_id]}}, {
				fields: {
					_id: 1,
					quantity: 1,
					cardGroups: 1,
					dateUpdated: 1
				}
			}).fetch();
			let totalQuantity;
			let cardGroupsCardset;
			for (let i = 0; i < cardsets.length; i++) {
				totalQuantity = 0;
				for (let k = 0; k < cardsets[i].cardGroups.length; k++) {
					cardGroupsCardset = Cardsets.find(cardsets[i].cardGroups[k]).fetch();
					if (cardGroupsCardset.length > 0) {
						if (!CardType.gotTranscriptBonus(cardGroupsCardset[0].cardType)) {
							totalQuantity += cardGroupsCardset[0].quantity;
						}
					}
				}
				let gotWorkload = false;
				if (Utilities.checkIfRepGotWorkloadCardset(cardsets[i])) {
					gotWorkload = true;
				}
				Cardsets.update(cardsets[i]._id, {
					$set: {
						quantity: totalQuantity,
						dateUpdated: new Date(),
						gotWorkload: gotWorkload
					}
				});
			}
		}
	},
	publishCardset: function (id, kind, price, visible) {
		check(id, String);
		check(kind, String);
		check(visible, Boolean);

		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(id, {
				$set: {
					kind: kind,
					price: price.toString().replace(",", "."),
					visible: visible,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			if (kind !== "personal") {
				Meteor.users.update(Meteor.user()._id, {
					$set: {
						visible: true
					}
				});
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	makeProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: false,
					request: true,
					visible: false,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	acceptProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isLecturer()) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: true,
					reviewer: this.userId,
					request: false,
					visible: true,
					dateUpdated: new Date()
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	declineProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isLecturer()) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: false,
					reviewer: this.userId,
					request: false,
					visible: false
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateLicense: function (id, license) {
		check(id, String);
		check(license, [String]);

		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(cardset._id, {
				$set: {
					license: license,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Changes the owner of the selected cardset. Only the super admin got access to this feature.
	 * @param {String} id - ID of the cardset to be updated
	 * @param {String} owner - The new owner for the cardset
	 */
	changeOwner: function (id, owner) {
		check(id, String);
		check(owner, String);
		if (UserPermissions.gotBackendAccess()) {
			if (Cardsets.findOne(id) && Meteor.users.findOne(owner)) {
				let cardset = Cardsets.findOne({_id: id});
				if (cardset.editors.includes(owner)) {
					Cardsets.update(
						{_id: id},
						{
							$pull: {editors: owner}
						});
					Cardsets.update(
						{_id: id},
						{
							$push: {editors: cardset.owner}
						});
				}
				Cardsets.update(id, {
					$set: {
						owner: owner,
						dateUpdated: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				Cards.update({cardset_id: id}, {
					$set: {
						owner: owner,
						dateUpdated: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				return true;
			} else {
				return false;
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Whitelist the cardset for the wordcloud
	 * @param {String} id - ID of the cardset to be updated
	 * @param {Boolean} status - Wordcloud status for the cardset: true = Add to wordcloud, false = remove from Wordcloud
	 */
	updateWordcloudStatus: function (id, status) {
		check(id, String);
		check(status, Boolean);
		if (UserPermissions.gotBackendAccess()) {
			Cardsets.update(id, {
				$set: {
					wordcloud: status,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Whitelist the cardset for the wordcloud
	 * @param {String} id - ID of the cardset to be updated
	 * @param {Boolean} status - Lecturer authorized status for the cardset: true = authorized, false = not authorized
	 */
	updateLecturerAuthorizedStatus: function (id, status) {
		check(id, String);
		check(status, Boolean);
		if (UserPermissions.gotBackendAccess()) {
			Cardsets.update(id, {
				$set: {
					lecturerAuthorized: status,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	}
});
