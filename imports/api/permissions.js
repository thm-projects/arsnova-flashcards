import {Meteor} from "meteor/meteor";

export let UserPermissions = class UserPermissions {
	static canCreateContent () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'university', 'lecturer', 'pro']) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static isAdmin () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static isNotBlockedOrFirstLogin () {
		return !Roles.userIsInRole(Meteor.userId(), ['blocked', 'firstLogin']);
	}

	static isNotBlocked () {
		return !Roles.userIsInRole(Meteor.userId(), ['blocked']);
	}

	static isOwner (content_owner) {
		return (content_owner === Meteor.userId() && UserPermissions.canCreateContent());
	}

	static isLecturer () {
		return (Roles.userIsInRole(Meteor.userId(), ['lecturer']));
	}
};
