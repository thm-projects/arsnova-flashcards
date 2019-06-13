import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {UserPermissions} from "./permissions";

export const AdminSettings = new Mongo.Collection("adminSettings");

if (Meteor.isServer) {
	Meteor.publish('pomodoroLandingPage', function () {
		return AdminSettings.find({name: "wordcloudPomodoroSettings"});
	});
	Meteor.publish('default_db_data', function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (UserPermissions.gotBackendAccess()) {
				return AdminSettings.find({});
			} else {
				return AdminSettings.find({name: {$in: ["seqSettings", 'mailSettings', 'pushSettings']}});
			}
		}
	});
}

Meteor.methods({
	updateWordcloudPomodoroSettings: function (enableWordcloudPomodoro) {
		check(enableWordcloudPomodoro, Boolean);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		AdminSettings.upsert({
				name: "wordcloudPomodoroSettings"
			},
			{
				$set: {
					enabled: enableWordcloudPomodoro
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
	updatePushSettings: function (enablePush) {
		check(enablePush, Boolean);

		if (!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		}
		AdminSettings.upsert({
				name: "pushSettings"
			},
			{
				$set: {
					enabled: enablePush
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
