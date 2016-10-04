import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Experience} from "./experience.js";
import {Cardsets} from "./cardsets.js";

export const Ratings = new Mongo.Collection("ratings");

if (Meteor.isServer) {
	Meteor.publish("ratings", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			return Ratings.find();
		}
	});
}

Meteor.methods({
	addRating: function (cardset_id, owner, rating) {
		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		}

		Ratings.insert({
			cardset_id: cardset_id,
			user: owner,
			rating: rating
		});

		Meteor.call("updateRelevance", cardset_id, function (error, relevance) {
			if (!error) {
				Cardsets.update(cardset_id, {
					$set: {
						relevance: Number(relevance)
					}
				});
			}
		});

		Experience.insert({
			type: 4,
			value: 1,
			date: new Date(),
			owner: Meteor.userId()
		});
		Meteor.call('checkLvl');
	}
});
