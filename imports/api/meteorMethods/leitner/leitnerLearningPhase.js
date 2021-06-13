import {Meteor} from "meteor/meteor";
import {LeitnerUserCardStats} from "../../subscriptions/leitner/leitnerUserCardStats";
import {LeitnerLearningWorkload} from "../../subscriptions/leitner/leitnerLearningWorkload";
import {check} from "meteor/check";
import {UserPermissions} from "../../../util/permissions";
import {Cardsets} from "../../subscriptions/cardsets.js";
import {LeitnerActivationDay} from "../../subscriptions/leitner/leitnerActivationDay";
import {Bonus} from "../../../util/bonus";
import {LeitnerLearningPhaseUtilities} from "../../../util/learningPhase";
import {LeitnerLearningPhase} from "../../subscriptions/leitner/leitnerLearningPhase";
import {Profile} from "../../../util/profile";
import * as config from "../../../config/bonusForm.js";
import * as pomodoroConfig from "../../../config/pomodoroTimer.js";
import * as bonusFormConfig from "../../../config/bonusForm";
import {LeitnerLearningWorkloadUtilities} from "../../../util/learningWorkload";
import {LeitnerPerformanceHistory} from "../../subscriptions/leitner/leitnerPerformanceHistory";
import {LearningStatisticsUtilities} from "../../../util/learningStatistics";

Meteor.methods({
	initializePrivateLearningPhase: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset !== undefined) {
			let learningWorkload = LeitnerLearningWorkload.findOne({user_id: user_id, cardset_id: cardset_id, isActive: true});
			if (learningWorkload === undefined) {
				let learningPhaseID = LeitnerLearningPhase.insert({
					cardset_id: cardset._id,
					isActive: true,
					isBonus: false,
					createdAt: new Date(),
					updatedAt: new Date(),
					lastEditor: Meteor.userId(),
					daysBeforeReset: config.defaultDaysBeforeReset,
					start: new Date(),
					end: new Date(8640000000000000),
					registrationPeriod: new Date(8640000000000000),
					intervals: config.defaultIntervals,
					maxCards: config.defaultMaxWorkload,
					bonusPoints: {
						minLearned: 0,
						maxPoints: 100
					},
					simulator: {
						errorCount: config.defaultErrorCount
					},
					forceNotifications: {
						mail: false,
						push: false
					},
					strictTimer: false,
					learningStatistics: {
						answerTime: {
							arithmeticMean: 0,
							median: 0,
							standardDeviation: 0
						}
					},
					pomodoroTimer: {
						quantity: pomodoroConfig.defaultSettings.goal,
						workLength: pomodoroConfig.defaultSettings.work,
						breakLength: pomodoroConfig.defaultSettings.break,
						soundConfig: pomodoroConfig.defaultSettings.sounds
					}});
				Meteor.call('initializeLeitnerWorkloadData', learningPhaseID, cardset_id, user_id);
			}  else {
				throw new Meteor.Error('Active learning phase already exists');
			}
		} else {
			throw new Meteor.Error('Could not find cardset');
		}
	},
	/**
	 * Deactivate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be deactivated.
	 */
	deactivateBonus: function (id) {
		check(id, String);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			let learningPhase = LeitnerLearningPhase.findOne({cardset_id: cardset._id, isActive: true, isBonus: true});
			if (learningPhase !== undefined) {
				LeitnerLearningPhase.update({
					_id: learningPhase._id
				}, {$set: {
						isActive: false,
						updatedAt: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				LeitnerLearningWorkload.update({
					learning_phase_id: learningPhase._id
				}, {$set: {
						isActive: false,
						updatedAt: new Date()
					}
				}, {multi: true});
				Cardsets.update(id, {
					$set: {
						dateUpdated: new Date(),
						lastEditor: Meteor.userId(),
						bonusStatus: LeitnerLearningPhaseUtilities.setLeitnerBonusStatus(LeitnerLearningPhase.findOne({_id: learningPhase._id}))
					}
				});
			} else {
				throw new Meteor.Error("No active learning phase bonus found");
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Activate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {String} title - Optional title for the learning phase
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
	 * @param {boolean} strictWorkloadTimer - Does this Bonus enforce the minimum amount of pomdori time for the workload?
	 * @param {Object} forceNotifications - Force mail or push notifications
	 */
	activateBonus: function (id, title, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod, maxBonusPoints, pomodoroTimerQuantity, pomodoroTimerWorkLength, pomodoroTimerBreakLength, pomodoroTimerSoundConfig, errorCount, minLearned, strictWorkloadTimer, forceNotifications) {
		check(id, String);
		check(title, String);
		if (title.length > bonusFormConfig.maxTitleLength) {
			throw new Meteor.Error(`Title surpasses a length of ${bonusFormConfig.maxTitleLength}`);
		} else {
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
			check(errorCount, [Number]);
			check(minLearned, Number);
			check(strictWorkloadTimer, Boolean);
			check(forceNotifications.mail, Boolean);
			check(forceNotifications.push, Boolean);

			let cardset = Cardsets.findOne(id);
			if (cardset !== undefined  && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
				let learningPhase = LeitnerLearningPhase.findOne({isBonus: true, isActive: true, cardset_id: cardset._id});
				if (learningPhase === undefined) {
					intervals = intervals.sort(
						function (a, b) {
							return a - b;
						}
					);

					let learningPhaseID = LeitnerLearningPhase.insert({
						cardset_id: cardset._id,
						title: title,
						isActive: true,
						isBonus: true,
						createdAt: new Date(),
						updatedAt: new Date(),
						lastEditor: Meteor.userId(),
						daysBeforeReset: daysBeforeReset,
						start: dateStart,
						end: dateEnd,
						registrationPeriod: registrationPeriod,
						intervals: intervals,
						maxCards: maxWorkload,
						bonusPoints: {
							minLearned: minLearned,
							maxPoints: Math.floor(maxBonusPoints)
						},
						simulator: {
							errorCount: errorCount
						},
						forceNotifications: forceNotifications,
						strictTimer: strictWorkloadTimer,
						learningStatistics: {
							answerTime: {
								arithmeticMean: 0,
								median: 0,
								standardDeviation: 0
							}
						},
						pomodoroTimer: {
							quantity: pomodoroTimerQuantity,
							workLength: pomodoroTimerWorkLength,
							breakLength: pomodoroTimerBreakLength,
							soundConfig: pomodoroTimerSoundConfig
						}
					});

					Cardsets.update({
							_id: cardset._id
						}, {$set: {
								dateUpdated: new Date(),
								lastEditor: Meteor.userId(),
								bonusStatus: LeitnerLearningPhaseUtilities.setLeitnerBonusStatus(LeitnerLearningPhase.findOne({
									_id: learningPhaseID,
									isBonus: true,
									isActive: true,
									cardset_id: cardset._id
								}))
							}}
					);
					return learningPhaseID;
				} else {
					throw new Meteor.Error("Active learning phase bonus already exists");
				}
			} else {
				throw new Meteor.Error("not-authorized");
			}
		}
	},
	deleteArchivedBonus: function (id) {
		check(id, String);

		let learningPhase = LeitnerLearningPhase.findOne({_id: id, isActive: false, isBonus: true});
		if (learningPhase !== undefined) {
			let cardset = Cardsets.findOne({_id: learningPhase.cardset_id});
			if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
				LeitnerLearningWorkload.remove({
					learning_phase_id: learningPhase._id
				});
				LeitnerActivationDay.remove({
					learning_phase_id: learningPhase._id
				});
				LeitnerUserCardStats.remove({
					learning_phase_id: learningPhase._id
				});
				LeitnerPerformanceHistory.remove({
					learning_phase_id: learningPhase._id
				});
				LeitnerLearningPhase.remove({
					_id: learningPhase._id
				});
				let remainingBonusPhases = LeitnerLearningPhase.find({cardset_id: learningPhase.cardset_id, isBonus: true}).count();
				if (remainingBonusPhases === 0) {
					Cardsets.update({
						_id: learningPhase.cardset_id
					}, {
						$set: {
							dateUpdated: new Date(),
							lastEditor: Meteor.userId(),
							bonusStatus: 0
						}
					});
				}
				return remainingBonusPhases;
			} else {
				throw new Meteor.Error("not-authorized");
			}
		} else {
			throw new Meteor.Error("Can't find inactive learning phase bonus");
		}
	},
	/**
	 * Updates the settings of a learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {String} title - Optional title for the learning phase
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
	 * @param {boolean} strictWorkloadTimer - Does this Bonus enforce the minimum amount of pomdori time for the workload?
	 * @param {Object} forceNotifications - Force mail or push notifications
	 */
	updateBonus: function (id, title, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod, maxBonusPoints, pomodoroTimerQuantity, pomodoroTimerWorkLength, pomodoroTimerBreakLength, pomodoroTimerSoundConfig, errorCount, minLearned, strictWorkloadTimer, forceNotifications) {
		check(id, String);
		check(title, String);
		if (title.length > bonusFormConfig.maxTitleLength) {
			throw new Meteor.Error(`Title surpasses a length of ${bonusFormConfig.maxTitleLength}`);
		} else {
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
			check(errorCount, [Number]);
			check(minLearned, Number);
			check(strictWorkloadTimer, Boolean);
			check(forceNotifications.mail, Boolean);
			check(forceNotifications.push, Boolean);

			let cardset = Cardsets.findOne(id);
			if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
				let learningPhase = LeitnerLearningPhase.findOne({cardset_id: cardset._id, isActive: true, isBonus: true});
				if (learningPhase !== undefined) {
					intervals = intervals.sort(
						function (a, b) {
							return a - b;
						}
					);

					LeitnerLearningPhase.update({
							_id: learningPhase._id
						},
						{$set: {
								updatedAt: new Date(),
								lastEditor: Meteor.userId(),
								title: title,
								daysBeforeReset: daysBeforeReset,
								start: dateStart,
								end: dateEnd,
								registrationPeriod: registrationPeriod,
								intervals: intervals,
								maxCards: maxWorkload,
								bonusPoints: {
									minLearned: minLearned,
									maxPoints: Math.floor(maxBonusPoints)
								},
								simulator: {
									errorCount: errorCount
								},
								forceNotifications: forceNotifications,
								strictTimer: strictWorkloadTimer,
								pomodoroTimer: {
									quantity: pomodoroTimerQuantity,
									workLength: pomodoroTimerWorkLength,
									breakLength: pomodoroTimerBreakLength,
									soundConfig: pomodoroTimerSoundConfig
								}
							}
						});

					Cardsets.update({
							_id: cardset._id
						}, {$set: {
								dateUpdated: new Date(),
								lastEditor: Meteor.userId(),
								bonusStatus: LeitnerLearningPhaseUtilities.setLeitnerBonusStatus(LeitnerLearningPhase.findOne({_id: learningPhase._id}))
							}}
					);
					return learningPhase._id;
				} else {
					throw new Meteor.Error("Can't find active learning phase bonus");
				}
			} else {
				throw new Meteor.Error("not-authorized");
			}
		}
	},
	updateArchivedBonus: function (learning_phase_id, title, maxBonusPoints, minLearned) {
		check(learning_phase_id, String);
		check(title, String);
		if (title.length > bonusFormConfig.maxTitleLength) {
			throw new Meteor.Error(`Title surpasses a length of ${bonusFormConfig.maxTitleLength}`);
		} else {
			check(maxBonusPoints, Number);
			check(minLearned, Number);

			let learningPhase = LeitnerLearningPhase.findOne({_id: learning_phase_id, isActive: false, isBonus: true});
			if (learningPhase !== undefined) {
				LeitnerLearningPhase.update({
						_id: learningPhase._id
					},
					{$set: {
							updatedAt: new Date(),
							lastEditor: Meteor.userId(),
							title: title,
							bonusPoints: {
								minLearned: minLearned,
								maxPoints: Math.floor(maxBonusPoints)
							}
						}
					});
			} else {
				throw new Meteor.Error("Can't find archived learning phase bonus");
			}
		}
	},
	updateCurrentBonusPoints: function (cardset_id) {
		check(cardset_id, String);
		if (!Meteor.isServer) {
			return;
		}
		const cardset = Cardsets.findOne(cardset_id);
		//Only update bonus points in learning bonus cardsets
		if (!cardset.learningActive) {
			return;
		}
		//Get Users
		const users = LeitnerLearningWorkload.find({
				cardset_id: cardset_id,
				"leitner.bonus": true
			},
			{
				fields: {user_id: 1, _id: 0}
			}).map(elem => elem.user_id);
		//If no user is in this bonus cardset, return
		if (!users.length) {
			return;
		}
		const box6Counts = {};
		users.forEach(user => box6Counts[user] = 0);
		//Count users their box 6 cards
		LeitnerUserCardStats.find({
				cardset_id: cardset_id,
				box: 6
			},
			{
				fields: {_id: 0, user_id: 1}
			}).forEach(card => ++box6Counts[card.user_id]);
		//Get the amount of learnable questions
		let amountOfLearnableCards;
		if (!cardset.shuffled) {
			amountOfLearnableCards = cardset.quantity;
		} else {
			//if shuffled, it could contain non learnable questions
			amountOfLearnableCards = LeitnerUserCardStats.find({
				user_id: users[0],
				cardset_id: cardset_id
			}).count();
		}
		//Calculate bonus points & update
		users.forEach(user => {
			const task_id = LeitnerActivationDay.findOne({
					cardset_id: cardset_id,
					user_id: user
				},
				{
					sort: {createdAt: -1},
					fields: {_id: 1}
				})._id;
			const bonusPoints = Bonus.getAchievedBonus(box6Counts[user], LeitnerLearningPhaseUtilities.getActiveBonus(cardset._id).bonusPoints, amountOfLearnableCards);
			LeitnerActivationDay.update(
				{
					_id: task_id
				},
				{
					$set: {
						"bonusPoints.atEnd": bonusPoints
					}
				});
		});
	},
	leaveBonus: function (cardset_id, target_id = undefined) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1}});
		if (cardset !== undefined) {
			let user_id = Meteor.userId();
			if ((UserPermissions.isOwner(cardset._id) || UserPermissions.isAdmin()) && target_id !== undefined) {
				check(target_id, String);
				user_id = target_id;
			}
			if (Bonus.isInBonus(cardset._id, user_id)) {
				let leitnerWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset._id, user_id);
				if (leitnerWorkload !== undefined) {
					LeitnerLearningWorkload.remove({
						_id: leitnerWorkload._id,
						learning_phase_id: leitnerWorkload.learning_phase_id,
						cardset_id: cardset_id,
						user_id: user_id
					});
					LeitnerActivationDay.remove({
						workload_id: leitnerWorkload._id,
						learning_phase_id: leitnerWorkload.learning_phase_id,
						cardset_id: cardset_id,
						user_id: user_id
					});
					LeitnerUserCardStats.remove({
						workload_id: leitnerWorkload._id,
						learning_phase_id: leitnerWorkload.learning_phase_id,
						cardset_id: cardset_id,
						user_id: user_id
					});
					LeitnerPerformanceHistory.remove({
						workload_id: leitnerWorkload._id,
						learning_phase_id: leitnerWorkload.learning_phase_id,
						cardset_id: cardset_id,
						user_id: user_id
					});

					Meteor.call("updateLearnerCount", cardset._id);
					Meteor.call('updateWorkloadCount', user_id);
					LearningStatisticsUtilities.updateLearningPhaseStats(leitnerWorkload.learning_phase_id);
				} else {
					throw new Meteor.Error("Could not find active bonus workload");
				}
			} else {
				throw new Meteor.Error("User is not in an active bonus");
			}
		} else {
			throw new Meteor.Error("Could not find cardset");
		}
	},
	joinBonus: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1}});
		if (cardset !== undefined) {
			if (Bonus.canJoinBonus(cardset._id) && Bonus.isRegistrationPeriodActive(cardset._id) && Profile.isCompleted(Meteor.user())) {
				let learningPhase = LeitnerLearningPhase.findOne({
					cardset_id: cardset._id,
					isActive: true,
					isBonus: true
				});
				if (learningPhase !== undefined) {
					//Deactive private workloads
					let leitnerPrivateWorkload = LeitnerLearningWorkload.findOne({
						cardset_id: cardset._id,
						user_id: Meteor.userId(),
						isActive: true,
						isBonus: false
					});
					if (leitnerPrivateWorkload !== undefined) {
						LeitnerLearningWorkload.update({
							_id: leitnerPrivateWorkload._id
						}, {$set: {
								isActive: false,
								updatedAt: new Date()
							}
						});
						LeitnerLearningPhase.update({
							_id: leitnerPrivateWorkload.learning_phase_id
						}, {$set: {
								isActive: false,
								updatedAt: new Date(),
								lastEditor: Meteor.userId()
							}
						});
					}
					Meteor.call('initializeLeitnerWorkloadData', learningPhase._id, cardset._id, Meteor.userId());
					Meteor.call('deleteWozniak', cardset._id);
					LeitnerLearningWorkload.update({
							learning_phase_id: learningPhase._id,
							cardset_id: cardset._id,
							user_id: Meteor.userId()
						},
						{
							$set: {
								isActive: true,
								isBonus: true,
								updatedAt: new Date()
							}
						}
					);
					Meteor.call("updateLearnerCount", cardset_id);
					Meteor.call('updateWorkloadCount', Meteor.userId());
				} else {
					throw new Meteor.Error("Could not find active learning phase bonus");
				}
			} else {
				throw new Meteor.Error("User can not join bonus");
			}
		} else {
			throw new Meteor.Error("Could not find cardset");
		}
	}
});
