import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Check} from "meteor/check";

export const AdminSettings = new Mongo.Collection("adminSettings");

if (Meteor.isServer) {
	Meteor.publish('default_db_data', function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			return AdminSettings.find({});
		}
	});
}

Meteor.methods({
	updateInterval: function (inv1, inv2, inv3) {
		check(inv1, Number);
		check(inv2, Number);
		check(inv3, Number);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		AdminSettings.update(
			{
				name: "seqSettings"
			},
			{
				$set: {
					seqOne: inv1,
					seqTwo: inv2,
					seqThree: inv3
				}
			});
	}
});
