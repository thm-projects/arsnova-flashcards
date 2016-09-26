import {Meteor} from "meteor/meteor";

export const Badges = new TAPi18n.Collection("badges");

if (Meteor.isServer) {
	Meteor.publish("badges", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			return Badges.find();
		}
	});
}
