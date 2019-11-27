import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {UserPermissions} from "./permissions";
import {AdminSettings} from "./subscriptions/adminSettings";

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
