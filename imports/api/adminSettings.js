import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const AdminSettings = new Mongo.Collection("adminSettings");

if (Meteor.isServer) {
	Meteor.publish('default_db_data', function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (Roles.userIsInRole(this.userId, ["admin", "editor"])) {
				return AdminSettings.find({});
			} else {
				return AdminSettings.find({name: "seqSettings"});
			}
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
	},
	updateMailSettings: function (enableMails) {
		check(enableMails, Boolean);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		AdminSettings.upsert({
				name: "mailSettings"
			},
			{
				$set: {
					enabled: enableMails
				}
			});
	},
	changeNotificationTarget: function (target) {
		check(target, String);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		let user = Meteor.users.findOne({_id: target});
		if (user !== undefined && user.email !== undefined && user.email !== "" && user.profile.givenname !== undefined && user.profile.givenname !== "" && user.profile.birthname !== undefined && user.profile.birthname !== "") {
			AdminSettings.upsert({
					name: "testNotifications"
				},
				{
					$set: {
						target: target
					}
				});
			return true;
		} else {
			return false;
		}
	}
});
