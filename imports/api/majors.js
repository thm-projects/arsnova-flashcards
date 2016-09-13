import {Meteor} from 'meteor/meteor';

export const Majors = new TAPi18n.Collection("majors");

if (Meteor.isServer) {
	Meteor.publish("majors", function () {
		return Majors.find();
	});
}
