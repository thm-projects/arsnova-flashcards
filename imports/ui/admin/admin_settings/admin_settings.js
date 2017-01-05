import {Meteor} from "meteor/meteor";
import {AdminSettings} from "../../../api/adminSettings.js";
import "./admin_settings.html";

Template.admin_settings.events({
	'change #mail-enabled': function () {
		Meteor.call("updateMailSettings", true);
	},
	'change #mail-disabled': function () {
		Meteor.call("updateMailSettings", false);
	}
});

Template.admin_settings.helpers({
	isMailEnabled: function (type) {
		return (type == AdminSettings.findOne({name: "mailSettings"}).enabled) ? "checked": "";
	}
});
