import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../api/subscriptions/cardsets";
import {Paid} from "../api/subscriptions/paid";
import {ServerStyle} from "./styles.js";
import {MainNavigation} from "./mainNavigation";

let roleFree = {
	string: 'standard',
	exportString: 'free',
	number: 0
};

let roleEdu = {
	string: 'university',
	exportString: 'edu',
	number: 1
};

let rolePro = {
	string: 'pro',
	number: 2
};

let roleLecturer = {
	string: 'lecturer',
	number: 3
};

let roleGuest = {
	string: 'guest',
	number: 4
};

let roleEditor = {
	string: 'editor',
	number: 5
};

let roleAdmin = {
	string: 'admin',
	number: 6
};

let roleLandingPage = {
	string: 'landingPage',
	number: 7
};

export let UserPermissions = class UserPermissions {
	static canAccessFrontend () {
		return Meteor.user() || MainNavigation.isGuestLoginActive();
	}

	static canCreateContent () {
		if (this.isAdmin() || Roles.userIsInRole(Meteor.userId(), ServerStyle.getUserRolesWithCreatePermission()) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static isSocialLogin () {
		if (Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'university', 'lecturer', 'pro']) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static gotBackendAccess () {
		if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static isAdmin () {
		if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && this.isNotBlockedOrFirstLogin()) {
			return true;
		}
	}

	static isCardsLogin (user = undefined) {
		if (user !== undefined) {
			return user.services.password !== undefined;
		} else {
			return Meteor.user().services.password !== undefined;
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

	static isEdu () {
		return (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['university']));
	}

	static isPro () {
		return (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['pro']));
	}

	static isLecturer () {
		return (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['lecturer']));
	}

	static hasCardsetPermission (cardset_id) {
		if (!Meteor.isServer) {
			if (FlowRouter.getRouteName() === "demo" || FlowRouter.getRouteName() === "making") {
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

	static getHighestRole (toNumber = true, userId = undefined) {
		let highestRole = roleGuest.string;
		if (!Meteor.isServer && !MainNavigation.isGuestLoginActive() && !Meteor.user()) {
			highestRole = roleLandingPage.string;
		} else if (Meteor.isServer || Meteor.user()) {
			let roles;
			if (Meteor.isClient && Meteor.user() && Meteor.user().roles !== undefined) {
				roles = Meteor.user().roles;
			} else {
				roles = Meteor.users.findOne({_id: userId}).roles;
			}
			for (let i = 0; i < roles.length; i++) {
				switch (roles[i]) {
					case roleFree.string:
						if (highestRole === roleGuest.string) {
							highestRole = roles[i];
						}
						break;
					case roleEdu.string:
						if (highestRole === roleGuest.string || highestRole === roleFree.string) {
							highestRole = roles[i];
						}
						break;
					case rolePro.string:
						if (highestRole === roleGuest.string || highestRole === roleFree.string || highestRole === roleEdu.string) {
							highestRole = roles[i];
						}
						break;
					case roleLecturer.string:
						if (highestRole === roleGuest.string || highestRole === roleFree.string || highestRole === roleEdu.string || highestRole === rolePro.string) {
							highestRole = roles[i];
						}
						break;
					case roleEditor.string:
						if (highestRole !== roleAdmin.string) {
							highestRole = roles[i];
						}
						break;
					case roleAdmin.string:
						highestRole = roles[i];
						break;
				}
			}
		}
		if (toNumber) {
			switch (highestRole) {
				case roleFree.string:
					highestRole = roleFree.number;
					break;
				case roleEdu.string:
					highestRole = roleEdu.number;
					break;
				case rolePro.string:
					highestRole = rolePro.number;
					break;
				case roleLecturer.string:
					highestRole = roleLecturer.number;
					break;
				case roleGuest.string:
					highestRole = roleGuest.number;
					break;
				case roleEditor.string:
					highestRole = roleEditor.number;
					break;
				case roleAdmin.string:
					highestRole = roleAdmin.number;
					break;
				case roleLandingPage.string:
					highestRole = roleLandingPage.number;
					break;
			}
		} else {
			switch (highestRole) {
				case roleFree.string:
					highestRole = roleFree.exportString;
					break;
				case roleEdu.string:
					highestRole = roleEdu.exportString;
					break;
			}
		}
		return highestRole;
	}
};
