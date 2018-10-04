import {Meteor} from "meteor/meteor";

export let UserPermissions = class UserPermissions {
	static canCreateContent () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'university', 'lecturer', 'pro']) && this.isNotBlocked()) {
			return true;
		}
	}

	static isAdmin () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && this.isNotBlocked()) {
			return true;
		}
	}

	static isNotBlocked () {
		return !Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked']);
	}

	static isOwner (content_owner) {
		return (content_owner === Meteor.userId() && UserPermissions.canCreateContent());
	}

	static isLecturer () {
		return (Roles.userIsInRole(Meteor.userId(), ['lecturer']));
	}
};
