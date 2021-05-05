import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "../subscriptions/cardsets.js";
import {check} from "meteor/check";
import {UserPermissions} from "../../util/permissions";
import {CardsetUserlist} from "../../util/cardsetUserlist";
import {LeitnerPerformanceHistory} from "../subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningWorkload} from "../subscriptions/leitner/leitnerLearningWorkload";
import {Wozniak} from "../subscriptions/wozniak";
import {LeitnerLearningWorkloadUtilities} from "../../util/learningWorkload";
import {LeitnerLearningPhase} from "../subscriptions/leitner/leitnerLearningPhase";
import {LeitnerLearningPhaseUtilities} from "../../util/learningPhase";

export const Learned = new Mongo.Collection("learned");

if (Meteor.isServer) {
	Meteor.methods({
		disableLeitner: function (cardset_id) {
			check(cardset_id, String);

			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
			let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
			if (leitnerLearningWorkload !== undefined && !leitnerLearningWorkload.isBonus) {
				LeitnerLearningWorkload.update({
					_id: leitnerLearningWorkload._id,
					cardset_id: cardset_id,
					user_id: Meteor.userId()
				}, {
					$set: {
						isActive: false,
						updatedAt: new Date()
					}
				});
				LeitnerLearningPhase.update({
					_id: leitnerLearningWorkload.learning_phase_id,
					cardset_id: cardset_id
				}, {
					$set: {
						isActive: false,
						updatedAt: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				Meteor.call("updateLearnerCount", cardset_id);
				Meteor.call('updateWorkloadCount', Meteor.userId());
				return true;
			} else {
				throw new Meteor.Error("Could not find active workload");
			}
		},
		deleteWozniak: function (cardset_id) {
			check(cardset_id, String);

			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}

			Wozniak.remove({
				cardset_id: cardset_id,
				user_id: Meteor.userId()
			});
			Meteor.call("updateLearnerCount", cardset_id);
			Meteor.call('updateWorkloadCount', Meteor.userId());
			return true;
		},
		updateWozniak: function (cardset_id, card_id, grade) {
			check(cardset_id, String);
			check(card_id, String);
			check(grade, Number);

			// Make sure the user is logged in
			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}

			// EF (easiness factor) is a rating for how difficult the card is.
			// Grade: (0-2) Set reps and interval to 0, keep current EF (repeat card today)
			//        (3)   Set interval to 0, lower the EF, reps + 1 (repeat card today)
			//        (4-5) Reps + 1, interval is calculated using EF, increasing in time.

			let learned = Wozniak.findOne({
					cardset_id: cardset_id,
					card_id: card_id,
					user_id: Meteor.userId()

				}),
				ef = learned.ef,
				reps = learned.reps,
				nextDate = new Date();
			let interval = 0;

			if (grade < 3) {
				reps = 0;
			} else {
				ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
				if (ef < 1.3) {
					ef = 1.3;
				}
				reps = reps + 1;
				if (grade !== 3) {
					switch (reps) {
						case 1:
							interval = 1;
							break;
						case 2:
							interval = 6;
							break;
						default:
							interval = Math.ceil((reps - 1) * ef);
							break;
					}
					nextDate.setDate(nextDate.getDate() + interval);
				}
			}

			Wozniak.update(learned._id, {
				$set: {
					ef: ef,
					reps: reps,
					interval: interval,
					nextDate: nextDate
				}
			});
		},
		/** Updates the learner count of the cardset
		 *  @param {string} cardset_id - The cardset id of the cardset that is getting updated
		 * */
		updateLearnerCount: function (cardset_id) {
			check(cardset_id, String);
			// Make sure the user is logged in
			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				let learnersTotal = LeitnerLearningWorkload.find({cardset_id: cardset_id, isActive: true}).count();
				let learnersBonus = LeitnerLearningWorkload.find({cardset_id: cardset_id, isActive: true, isBonus: true}).count();
				Cardsets.update(cardset_id, {
					$set: {
						"workload.bonus.count": learnersBonus,
						"workload.normal.count": (learnersTotal - learnersBonus)
					}
				});
			}
		},
		/** Removes an user from an active bonus
		 *  @param {string} cardset_id - The cardset id of the cardset that is getting updated
		 *  @param {string} user_id - The _id of the user who should be removed
		 * */
		removeUserFromBonus: function (cardset_id, user_id) {
			check(cardset_id, String);
			check(user_id, String);
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (cardset !== undefined && (UserPermissions.isOwner(cardset.owner) || UserPermissions.isAdmin())) {
				Meteor.call('leaveBonus', cardset._id, user_id);
				let leitnerLearningPhase = LeitnerLearningPhaseUtilities.getActiveBonus(cardset._id);
				return CardsetUserlist.getLearners(LeitnerLearningWorkload.find({
					learning_phase_id: leitnerLearningPhase._id,
					cardset_id: cardset._id,
					isBonus: true}).fetch(), cardset._id, leitnerLearningPhase._id);
			} else {
				throw new Meteor.Error("not-authorized");
			}
		},
		skipLeitnerCard: function (card_id, cardset_id) {
			check(card_id, String);
			check(cardset_id, String);
			if (Meteor.user()) {
				let leitnerWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
				if (leitnerWorkload !== undefined) {
					LeitnerPerformanceHistory.update({
						learning_phase_id: leitnerWorkload.learning_phase_id,
						workload_id: leitnerWorkload._id,
						user_id: Meteor.userId(),
						cardset_id: cardset_id,
						card_id: card_id
					}, {
						$inc: {
							skipped: 1
						}
					});
				} else {
					throw new Meteor.Error("Could not find active workload");
				}
			} else {
				throw new Meteor.Error("not-authorized");
			}
		}
	});
}
