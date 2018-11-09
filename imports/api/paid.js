import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {UserPermissions} from "./permissions";

export const Paid = new Mongo.Collection("paid");

if (Meteor.isServer) {
	Meteor.publish("paidCardset", function (cardset_id) {
		if (this.userId && UserPermissions.isNotBlocked()) {
			return Paid.find({user_id: this.userId, cardset_id: cardset_id});
		}
	});
	Meteor.publish("paidCardsets", function () {
		if (this.userId && UserPermissions.isNotBlocked()) {
			return Paid.find({user_id: this.userId});
		}
	});
}

Meteor.methods({
	addPaid: function (cardset_id, amount) {
		check(cardset_id, String);
		check(amount, Number);

		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}

		Paid.insert({
			cardset_id: cardset_id,
			user_id: Meteor.userId(),
			date: new Date(),
			amount: amount
		});
	}
});
