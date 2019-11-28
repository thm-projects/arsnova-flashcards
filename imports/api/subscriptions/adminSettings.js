import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../permissions";

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
