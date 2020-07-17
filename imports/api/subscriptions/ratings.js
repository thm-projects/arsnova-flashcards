import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../util/styles";
import {UserPermissions} from "../../util/permissions";

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
