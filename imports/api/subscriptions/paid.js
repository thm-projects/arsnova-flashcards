import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../permissions";

export const Paid = new Mongo.Collection("paid");

if (Meteor.isServer) {
	Meteor.publish("paidCardset", function (cardset_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Paid.find({user_id: this.userId, cardset_id: cardset_id});
		} else {
			this.ready();
		}
	});
	Meteor.publish("paidCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Paid.find({user_id: this.userId});
		} else {
			this.ready();
		}
	});
}
