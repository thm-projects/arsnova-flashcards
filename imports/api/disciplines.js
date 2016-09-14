import {Meteor} from "meteor/meteor";

export const Disciplines = new TAPi18n.Collection("disciplines");

if (Meteor.isServer) {
	Meteor.publish("disciplines", function () {
		return Disciplines.find();
	});
}
