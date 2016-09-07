import {Meteor } from 'meteor/meteor';
import {Mongo } from 'meteor/mongo';

export const Badges = new TAPi18n.Collection("badges");

if (Meteor.isServer) {
	Meteor.publish("badges", function () {
		return Badges.find();
	});
}
