import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "./cardsets.js";
import {check} from "meteor/check";

export const Learned = new Mongo.Collection("learned");
export const Leitner = new Mongo.Collection("leitner");
export const Wozniak = new Mongo.Collection("wozniak");

if (Meteor.isServer) {
	Meteor.publish("leitner", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Roles.userIsInRole(this.userId, ["admin", "editor", "lecturer"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Leitner.find({
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
				return Leitner.find({
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
				return Leitner.find({
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
				return Leitner.find({user_id: this.userId});
			}
		}
	});
	Meteor.publish("wozniak", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Roles.userIsInRole(this.userId, ["admin", "editor", "lecturer"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Wozniak.find({
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
				return Wozniak.find({
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
				return Wozniak.find({
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
				return Wozniak.find({user_id: this.userId});
			}
		}
	});
	Meteor.publish("allLearned", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Leitner.find({
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
				return Leitner.find({});
			}
		}
	});


	Meteor.methods({
		clearLeitnerProgress: function (cardset_id) {
			check(cardset_id, String);

			if (!Roles.userIsInRole(this.userId, ["admin", "editor", "lecturer"])) {
				throw new Meteor.Error("not-authorized");
			}
			Leitner.remove({cardset_id: cardset_id});
			Meteor.call("updateLearnerCount", cardset_id);
		},
		addLeitner: function (cardset_id, card_id, user_id) {
			check(cardset_id, String);
			check(card_id, String);
			check(user_id, String);
			// Make sure the user is logged in
			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				Leitner.upsert({
					cardset_id: cardset_id,
					card_id: card_id,
					user_id: user_id
				}, {
					$set: {
						cardset_id: cardset_id,
						card_id: card_id,
						user_id: user_id
					},
					$setOnInsert: {
						box: 1,
						active: false,
						nextDate: new Date(),
						currentDate: new Date()
					}
				});
			}
		},
		addWozniak: function (cardset_id, card_id, user_id) {
			check(cardset_id, String);
			check(card_id, String);
			check(user_id, String);
			// Make sure the user is logged in
			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				Wozniak.upsert({
					cardset_id: cardset_id,
					card_id: card_id,
					user_id: user_id
				}, {
					$set: {
						cardset_id: cardset_id,
						card_id: card_id,
						user_id: user_id
					},
					$setOnInsert: {
						ef: 2.5,
						interval: 0,
						reps: 0,
						nextDate: new Date()
					}
				});
			}
		},
		/** Function marks an active leitner card as learned
		 *  @param {string} cardset_id - The cardset id from the card
		 *  @param {string} card_id - The id from the card
		 *  @param {boolean} isWrong - Did the user know the answer?
		 * */
		updateLeitner: function (cardset_id, card_id, isWrong) {
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

				var currentLearned = Leitner.findOne(query);

				if (currentLearned !== undefined) {
					var selectedBox = currentLearned.box + 1;
					var nextDate = new Date();

					if (isWrong) {
						selectedBox = 1;
					}

					nextDate = new Date(nextDate.getTime() + cardset.learningInterval[selectedBox - 1] * 86400000);

					Leitner.update(currentLearned._id, {
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
			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				let leitner = Leitner.find({cardset_id: cardset_id}).fetch();
				let wozniak = Wozniak.find({cardset_id: cardset_id}).fetch();
				let data = leitner.concat(wozniak);
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
