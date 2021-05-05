import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {LeitnerUserCardStats} from "../subscriptions/leitner/leitnerUserCardStats";
import {LeitnerLearningWorkload} from "../subscriptions/leitner/leitnerLearningWorkload";
import {Cardsets} from "../subscriptions/cardsets";
import {Bonus} from "../../util/bonus";
import {UserPermissions} from "../../util/permissions";
import {CardType} from "../../util/cardTypes";
import {LeitnerUtilities} from "../../util/leitner";
import {LeitnerActivationDay} from "../subscriptions/leitner/leitnerActivationDay";
import {PomodoroTimer} from "../../util/pomodoroTimer";
import {LeitnerLearningPhase} from "../subscriptions/leitner/leitnerLearningPhase";
import {LeitnerLearningPhaseUtilities} from "../../util/learningPhase";
import {LeitnerLearningWorkloadUtilities} from "../../util/learningWorkload";

Meteor.methods({
	initializeLeitnerWorkloadData: function (learning_phase_id, cardset_id, user_id) {
		check(learning_phase_id, String);
		check(cardset_id, String);
		check(user_id, String);
		let leitnerWorkload = LeitnerLearningWorkload.findOne({
			user_id: user_id,
			cardset_id: cardset_id,
			isActive: true
		});
		if (leitnerWorkload === undefined) {
			LeitnerLearningWorkload.insert({
				learning_phase_id: learning_phase_id,
				createdAt: new Date(),
				updatedAt: new Date(),
				cardset_id: cardset_id,
				user_id: user_id,
				nextLowestPriority: [-1, -1, -1, -1, -1],
				gotFinished: false
			});
		}
	},
	markLeitnerAutoPDF: function (cardset_id, card_id) {
		check(cardset_id, String);
		check(card_id, String);

		LeitnerUserCardStats.update({
				cardset_id: cardset_id,
				card_id: card_id,
				user_id: Meteor.userId()
			},
			{
				$set: {
					viewedPDF: true
				}
			}
		);
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
					let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset._id, Meteor.userId());
					if (leitnerLearningWorkload !== undefined) {
						let leitnerLearningPhase = LeitnerLearningPhaseUtilities.getActiveLearningPhase(undefined, undefined, leitnerLearningWorkload.learning_phase_id);
						if (leitnerLearningPhase !== undefined) {
							if (isNewcomer && (!Bonus.isInBonus(cardset._id, Meteor.userId()) || leitnerLearningPhase.end.getTime() > new Date().getTime())) {
								LeitnerUtilities.setCards(leitnerLearningPhase, leitnerLearningWorkload, cardset, Meteor.user(), false, isNewcomer);
							}
						} else {
							throw new Meteor.Error("Couldn't find active leitner learning phase");
						}
					} else {
						throw new Meteor.Error("Couldn't find active leitner learning workload");
					}
				}
			}
		}
	},
	updateLeitnerCardIndex: function (cardset_id) {
		check(cardset_id, String);
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1}});
			let leitnerWorkloadFilter = LeitnerLearningWorkload.find({cardset_id: cardset_id, isActive: true}).fetch().map(workload => workload._id);
			let activeLearners = LeitnerUserCardStats.find({workload_id: {$in: leitnerWorkloadFilter}, cardset_id: cardset._id}, {fields: {user_id: 1}}).fetch();
			activeLearners = _.uniq(activeLearners, false, d => d.user_id);
			for (const item of activeLearners) {
				LeitnerUtilities.addLeitnerCards(cardset, item.user_id);
			}
		}
	},
	updateLeitnerTimer: function (cardset_id) {
		check(cardset_id, String);
		let leitnerTask = LeitnerActivationDay.findOne({
			user_id: Meteor.userId(),
			cardset_id: cardset_id
		}, {
			sort: {createdAt: -1}
		});
		if (leitnerTask !== undefined) {
			if (leitnerTask.timer.status === 0) {
				LeitnerUtilities.updateWorkTimer(leitnerTask);
			} else if (leitnerTask.timer.status === 2) {
				LeitnerUtilities.updateBreakTimer(leitnerTask);
			}
		}
	},
	startLeitnerBreak: function (cardset_id) {
		check(cardset_id, String);

		let leitnerTask = LeitnerActivationDay.findOne({
			user_id: Meteor.userId(),
			cardset_id: cardset_id
		}, {
			sort: {createdAt: -1}
		});
		if (leitnerTask !== undefined) {
			if (PomodoroTimer.getRemainingTime(leitnerTask) <= 1) {
				LeitnerActivationDay.update({
						_id: leitnerTask._id
					},
					{
						$set: {
							'timer.lastCallback': new Date(),
							'timer.workload.current': 0,
							'timer.break.current': 0,
							'timer.status': 2

						},
						$inc: {
							'timer.workload.completed': 1
						}
					});
			}
		}
	},
	endLeitnerBreak: function (cardset_id) {
		check(cardset_id, String);

		let leitnerTask = LeitnerActivationDay.findOne({
			user_id: Meteor.userId(),
			cardset_id: cardset_id
		}, {
			sort: {createdAt: -1}
		});
		if (leitnerTask !== undefined) {
			if (PomodoroTimer.getRemainingTime(leitnerTask) <= 1) {
				LeitnerActivationDay.update({
						_id: leitnerTask._id
					},
					{
						$set: {
							'timer.lastCallback': new Date(),
							'timer.workload.current': 0,
							'timer.break.current': 0,
							'timer.status': 0
						},
						$inc: {
							'timer.break.completed': 1
						}
					});
			}
		}
	},
	getTempLearningPhaseData: function (cardset_id, user_id, workload_id) {
		check(cardset_id, String);
		check(user_id, String);
		check(workload_id, String);

		let query = {};
		if (cardset_id !== "null") {
			query.cardset_id = cardset_id;
		}
		if (user_id !== "null") {
			query.user_id = user_id;
		}
		if (workload_id !== "null") {
			query._id = workload_id;
		}
		let workload = LeitnerLearningWorkload.findOne(query);
		if (workload !== undefined) {
			return LeitnerLearningPhase.find({_id: workload.learning_phase_id}).fetch();
		} else {
			return [];
		}
	},
	getTempLeitnerData: function (cardset_id, user_id, workload_id, type) {
		check(cardset_id, String);
		check(user_id, String);
		check(workload_id, String);
		check(type, String);

		let options = {
			fields: {
				cardset_id: 1,
				original_cardset_id: 1,
				user_id: 1,
				box: 1,
				learning_phase_id: 1
			}
		};
		if (type === 'cardset') {
			let isCardsetOwnerAndLecturer = false;
			let targetUserIsInBonus = false;
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {owner: 1}});
			if (cardset !== undefined) {
				isCardsetOwnerAndLecturer = (cardset.owner === Meteor.userId() && UserPermissions.isLecturer());
			}
			let workload = LeitnerLearningWorkload.findOne({_id: workload_id, cardset_id: cardset_id, user_id: user_id});
			if (workload !== undefined) {
				targetUserIsInBonus = workload.isBonus;
			}
			if (Meteor.userId() === user_id || (UserPermissions.gotBackendAccess() && targetUserIsInBonus) || (isCardsetOwnerAndLecturer && targetUserIsInBonus)) {
				return LeitnerUserCardStats.find({cardset_id: cardset_id, user_id: user_id, workload_id: workload._id}, options).fetch();
			} else {
				return [];
			}
		} else if (type === 'user') {
			let activeWorkloads = LeitnerLearningWorkload.find({user_id: Meteor.userId(), isActive: true}).map(function (workload) {
				return workload._id;
			});
			return LeitnerUserCardStats.find({workload_id: {$in: activeWorkloads}, user_id: Meteor.userId()}, options).fetch();
		} else if (UserPermissions.gotBackendAccess()) {
			let activeWorkloads = LeitnerLearningWorkload.find({isActive: true}).map(function (workload) {
				return workload._id;
			});
			return LeitnerUserCardStats.find({workload_id: {$in: activeWorkloads}}, options).fetch();
		} else {
			return [];
		}
	}
});
