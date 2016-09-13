import {Meteor} from 'meteor/meteor';

export const Modules = new TAPi18n.Collection("modules");

if (Meteor.isServer) {
	Meteor.publish("modules", function () {
		return Modules.find();
	});
}
