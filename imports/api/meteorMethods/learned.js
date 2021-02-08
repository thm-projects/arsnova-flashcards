import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "../subscriptions/cardsets.js";
import {check} from "meteor/check";
import {UserPermissions} from "../../util/permissions";
import {CardsetUserlist} from "../../util/cardsetUserlist";
import {LeitnerUtilities} from "../../util/leitner";
import {Leitner} from "../subscriptions/leitner.js";
import {LeitnerHistory} from "../subscriptions/leitnerHistory";
import {Workload} from "../subscriptions/workload";
import {Wozniak} from "../subscriptions/wozniak";

export const Learned = new Mongo.Collection("learned");

if (Meteor.isServer) {
	Meteor.methods({
		deleteLeitner: function (cardset_id) {
			check(cardset_id, String);

			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
			Leitner.remove({
				cardset_id: cardset_id,
				user_id: Meteor.userId()
			});
			Meteor.call("updateLearnerCount", cardset_id);
			Meteor.call('updateWorkloadCount', Meteor.userId());
			LeitnerUtilities.updateLeitnerWorkload(cardset_id, Meteor.userId());
			Workload.update({
				cardset_id: cardset_id,
				user_id: Meteor.userId()
			}, {
				$unset: {
					"leitner.tasks": 1
				}
			});
			return true;
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
				let learnersTotal = Workload.find({cardset_id: cardset_id}).count();
				let learnersBonus = Workload.find({cardset_id: cardset_id, 'leitner.bonus': true}).count();
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
				Workload.update({
					user_id: user_id,
					cardset_id: cardset_id
				}, {
					$set: {
						"leitner.bonus": false
					}
				});
				Meteor.call("updateLearnerCount", cardset._id);
				return CardsetUserlist.getLearners(Workload.find({cardset_id: cardset._id, 'leitner.bonus': true}).fetch(), cardset._id);
			} else {
				throw new Meteor.Error("not-authorized");
			}
		},
		skipLeitnerCard: function (card_id, cardset_id) {
			check(card_id, String);
			check(cardset_id, String);
			if (Meteor.user()) {
				LeitnerHistory.update({
					user_id: Meteor.userId(),
					cardset_id: cardset_id,
					card_id: card_id
				}, {
					$inc: {
						skipped: 1
					}
				});
			} else {
				throw new Meteor.Error("not-authorized");
			}
		}
	});
}
