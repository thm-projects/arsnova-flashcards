import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "./cardsets.js";

export const Learned = new Mongo.Collection("learned");

if (Meteor.isServer) {
	Meteor.publish("learned", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			var cardsetsIds = Cardsets.find({
				owner: this.userId
			}).map(function (cardset) {
				return cardset._id;
			});

			var learned = Learned.find({
				$or: [
					{user_id: this.userId},
					{cardset_id: {$in: cardsetsIds}}
				]
			});
			return learned;
		}
	});
}

Meteor.methods({
	addLearned: function (cardset_id, card_id) {
		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		}
		Learned.upsert({
			cardset_id: cardset_id,
			card_id: card_id,
			user_id: Meteor.userId()
		}, {
			$set: {
				cardset_id: cardset_id,
				card_id: card_id,
				user_id: Meteor.userId()
			},
			$setOnInsert: {
				box: 1,
				ef: 2.5,
				reps: 0,
				interval: 0,
				nextDate: new Date(),
				currentDate: new Date()
			}
		});
	},
	updateLearned: function (learned_id, box) {
		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		}
		Learned.update(learned_id, {
			$set: {
				box: box,
				currentDate: new Date()
			}
		});
	},
	updateLearnedMemo: function (learned_id, grade) {
		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
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
	}
});
