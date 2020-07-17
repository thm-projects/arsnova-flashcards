import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Paid} from "../subscriptions/paid";

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
