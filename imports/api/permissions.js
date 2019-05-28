import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {Paid} from "./paid";
import {ServerStyle} from "./styles.js";

export let UserPermissions = class UserPermissions {
	static canCreateContent () {
		if (this.isAdmin() || Roles.userIsInRole(Meteor.userId(), ServerStyle.getUserRolesWithCreatePermission()) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static isSocialLogin () {
		if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'university', 'lecturer', 'pro']) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static gotBackendAccess () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin']) && this.isNotBlockedOrFirstLogin()) {
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

	static hasCardsetPermission (cardset_id) {
		if (!Meteor.isServer) {
			if (Router.current().route.getName() === "demo" || Router.current().route.getName() === "making") {
				return true;
			}
		}
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset === undefined) {
			return false;
		}
		let userId = Meteor.userId();
		let cardsetKind = cardset.kind;

		let hasRole = false;
		if (Roles.userIsInRole(userId, 'pro') ||
			(Roles.userIsInRole(userId, 'lecturer')) ||
			(Roles.userIsInRole(userId, 'admin')) ||
			(Roles.userIsInRole(userId, 'editor')) ||
			(Roles.userIsInRole(userId, 'university') && (cardsetKind === 'edu' || cardsetKind === 'free')) ||
			(cardsetKind === 'free') ||
			(Paid.find({cardset_id: cardset._id, user_id: userId}).count())) {
			hasRole = true;
		}
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId())) || hasRole;
	}
};
