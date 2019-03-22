import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "./cardsets.js";
import {check} from "meteor/check";
import {UserPermissions} from "./permissions";
import {ServerStyle} from "./styles";

export const Ratings = new Mongo.Collection("ratings");

if (Meteor.isServer) {
	Meteor.publish("cardsetUserRating", function (cardset_id) {
		if ((this.userId || ServerStyle.isLoginEnabled("guest"))  && UserPermissions.isNotBlockedOrFirstLogin()) {
			let user_id;
			if (this.userId) {
				user_id = this.userId;
			} else {
				user_id = "guest";
			}
			return Ratings.find({cardset_id: cardset_id, user_id: user_id});
		} else {
			this.ready();
		}
	});
}

Meteor.methods({
	rateCardset: function (cardset_id, rating) {
		check(cardset_id, String);
		check(rating, Number);

		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin() && !UserPermissions.isOwner(Cardsets.findOne({_id: cardset_id}).owner)) {
			if (Ratings.findOne({cardset_id: cardset_id, user_id: this.userId})) {
				Ratings.update({cardset_id: cardset_id, user_id: this.userId}, {
					$set: {
						rating: rating
					}
				});
			} else {
				Ratings.insert({
					cardset_id: cardset_id,
					user_id: this.userId,
					rating: rating
				});
			}
			Meteor.call('updateCardsetRating', cardset_id);
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateCardsetRating: function (cardset_id) {
		check(cardset_id, String);
		if (Meteor.isServer) {
			let ratings = Ratings.find({cardset_id: cardset_id}).fetch();
			let sum = 0;
			for (let i = 0; i < ratings.length; i++) {
				sum += ratings[i].rating;
			}
			if (sum !== 0) {
				sum = (sum / ratings.length).toFixed(2);
			}
			Cardsets.update(cardset_id, {
				$set: {
					rating: sum,
					raterCount: ratings.length
				}
			});
		}
	}
});
