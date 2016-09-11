import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const Categories = new TAPi18n.Collection("settings");

if (Meteor.isServer) {
	Meteor.publish("settings", function () {
		return Categories.find();
	});
}