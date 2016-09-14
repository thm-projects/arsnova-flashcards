import {Meteor} from "meteor/meteor";

export const Colleges = new TAPi18n.Collection("colleges");

if (Meteor.isServer) {
	Meteor.publish("colleges", function () {
		return Colleges.find();
	});
}
