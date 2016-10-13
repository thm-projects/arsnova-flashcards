import {Meteor} from "meteor/meteor";

export const Badges = new TAPi18n.Collection("badges");

if (Meteor.isServer) {
	Meteor.publish("badges", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			return Badges.find();
		}
	});
}
