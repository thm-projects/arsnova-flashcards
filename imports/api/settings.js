import {Meteor} from "meteor/meteor";
import {AdminSettings} from "./adminSettings";

export const Categories = new TAPi18n.Collection("settings");

if (Meteor.isServer) {
	Meteor.publish("settings", function () {
		return Categories.find();
	});
}

export let ServerSettings = class ServerSettings {
	static isMailEnabled () {
		return AdminSettings.findOne({name: "mailSettings"}).enabled;
	}

	static isPushEnabled () {
		return AdminSettings.findOne({name: "pushSettings"}).enabled;
	}
};
