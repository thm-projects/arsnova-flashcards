import {Meteor} from 'meteor/meteor';

export const Categories = new TAPi18n.Collection("categories");

if (Meteor.isServer) {
	Meteor.publish("categories", function () {
		return Categories.find();
	});
}
