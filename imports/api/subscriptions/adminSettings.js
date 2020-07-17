import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../../util/permissions";

export const AdminSettings = new Mongo.Collection("adminSettings");

if (Meteor.isServer) {
	Meteor.publish('pomodoroLandingPage', function () {
		return AdminSettings.find({name: "wordcloudPomodoroSettings"});
	});
	Meteor.publish('defaultAppData', function () {
		if (UserPermissions.gotBackendAccess()) {
			return AdminSettings.find({});
		} else {
			return AdminSettings.find({name: {$in: ["seqSettings", 'mailSettings', 'pushSettings', 'plantUMLServerSettings']}});
		}
	});
}
