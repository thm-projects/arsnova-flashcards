import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "./cardsets.js";
import {check} from "meteor/check";

export const Learned = new Mongo.Collection("learned");

if (Meteor.isServer) {
	Meteor.publish("learned", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Roles.userIsInRole(this.userId, ["admin", "editor", "lecturer"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Learned.find({
					$or: [
						{user_id: this.userId},
						{
							cardset_id: {
								$in: Cardsets.find({
									$or: [
										{owner: this.userId},
										{learningActive: true},
										{college: Meteor.settings.public.university.default}
									]
								}).map(function (cardset) {
									return cardset._id;
								})
							}
						}
					]
				});
			} else {
				return Learned.find({
					$or: [
						{user_id: this.userId},
						{
							cardset_id: {
								$in: Cardsets.find({
									$or: [
										{owner: this.userId},
										{learningActive: true}
									]
								}).map(function (cardset) {
									return cardset._id;
								})
							}
						}
					]
				});
			}
		} else if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Learned.find({
					user_id: this.userId,
					cardset_id: {
						$in: Cardsets.find({
							$or: [
								{college: Meteor.settings.public.university.default}
							]
						}).map(function (cardset) {
							return cardset._id;
						})
					}
				});
			} else {
				return Learned.find({user_id: this.userId});
			}
		}
	});
	Meteor.publish("allLearned", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Learned.find({
					cardset_id: {
						$in: Cardsets.find({
							$or: [
								{college: Meteor.settings.public.university.default}
							]
						}).map(function (cardset) {
							return cardset._id;
						})
					}
				});
			} else {
				return Learned.find({});
			}
		}
	});


	Meteor.methods({
		clearLearningProgress: function (cardset_id) {
			check(cardset_id, String);

			if (!Roles.userIsInRole(this.userId, ["admin", "editor", "lecturer"])) {
				throw new Meteor.Error("not-authorized");
			}
			Learned.remove({cardset_id: cardset_id});
			Meteor.call("updateLearnerCount", cardset_id);
		},
		addLearned: function (cardset_id, card_id, user_id, isMemo) {
			check(cardset_id, String);
			check(card_id, String);
			check(user_id, String);
			check(isMemo, Boolean);
			// Make sure the user is logged in
			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				if (Learned.findOne({cardset_id: cardset_id, user_id: user_id, isMemo: false})) {
					isMemo = false;
				}
				Learned.upsert({
					cardset_id: cardset_id,
					card_id: card_id,
					user_id: user_id
				}, {
					$set: {
						cardset_id: cardset_id,
						card_id: card_id,
						user_id: user_id,
						isMemo: isMemo
					},
					$setOnInsert: {
						box: 1,
						ef: 2.5,
						reps: 0,
						interval: 0,
						active: false,
						nextDate: new Date(),
						currentDate: new Date()
					}
				});
			}
		},
		/** Function marks an active card as learned
		 *  @param {string} cardset_id - The cardset id from the card
		 *  @param {string} card_id - The id from the card
		 *  @param {boolean} isWrong - Did the user know the answer?
		 * */
		updateLearned: function (cardset_id, card_id, isWrong) {
			// Make sure the user is logged in
			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
			check(cardset_id, String);
			check(card_id, String);
			check(isWrong, Boolean);

			var cardset = Cardsets.findOne({_id: cardset_id});

			if (cardset !== undefined) {
				var query = {};

				query.card_id = card_id;
				query.cardset_id = cardset_id;
				query.user_id = Meteor.userId();
				query.active = true;

				var currentLearned = Learned.findOne(query);

				if (currentLearned !== undefined) {
					var selectedBox = currentLearned.box + 1;
					var nextDate = new Date();

					if (isWrong) {
						selectedBox = 1;
					}

					nextDate = new Date(nextDate.getTime() + cardset.learningInterval[selectedBox - 1] * 86400000);

					Learned.update(currentLearned._id, {
						$set: {
							box: selectedBox,
							active: false,
							nextDate: nextDate,
							currentDate: new Date()
						}
					});
				}
			}
		},
		deleteLearned: function (cardset_id) {
			check(cardset_id, String);

			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}

			Learned.remove({
				cardset_id: cardset_id,
				user_id: Meteor.userId()
			});
			Meteor.call("updateLearnerCount", cardset_id);
		},
		updateLearnedMemo: function (learned_id, grade) {
			check(learned_id, String);
			check(grade, Number);

			// Make sure the user is logged in
			if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}

			// EF (easiness factor) is a rating for how difficult the card is.
			// Grade: (0-2) Set reps and interval to 0, keep current EF (repeat card today)
			//        (3)   Set interval to 0, lower the EF, reps + 1 (repeat card today)
			//        (4-5) Reps + 1, interval is calculated using EF, increasing in time.

			var learned = Learned.findOne(learned_id),
				ef = learned.ef,
				reps = learned.reps,
				nextDate = new Date();
			var interval = 0;

			if (grade < 3) {
				reps = 0;
				interval = 0;
			} else {
				ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
				if (ef < 1.3) {
					ef = 1.3;
				}
				reps = reps + 1;
				if (grade === 3) {
					interval = 0;
				} else {
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

			Learned.update(learned_id, {
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
			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				let data = Learned.find({cardset_id: cardset_id}).fetch();
				let distinctData = _.uniq(data, false, function (d) {
					return d.user_id;
				});
				let learners = _.pluck(distinctData, "user_id");
				Cardsets.update(cardset_id, {
					$set: {
						learners: learners.length
					}
				});
			}
		}
	});
}
