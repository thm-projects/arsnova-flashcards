import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {UserPermissions} from "../../util/permissions";

Meteor.methods({
	updateUser: function (user_id, visible, email, blockedtext) {
		check(user_id, String);
		check(visible, Boolean);

		if (email !== " ") {
			check(email, String);
		}
		if (blockedtext !== null)
		{
			check(blockedtext, String);
		}

		if (!!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(user_id, {
			$set: {
				visible: visible,
				email: email,
				blockedtext: blockedtext
			}
		});
	},
	updateRoles: function (user_id, newRole) {
		check(user_id, String);
		check(newRole, String);

		if (!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		}

		var roles;

		if (newRole === 'pro' && !Roles.userIsInRole(user_id, 'pro')) {
			Roles.removeUsersFromRoles(user_id, 'standard');
			roles = Roles.getRolesForUser(user_id);
			roles.push('pro');
		} else if (newRole === 'standard' && !Roles.userIsInRole(user_id, 'standard')) {
			Roles.removeUsersFromRoles(user_id, 'pro');
			roles = Roles.getRolesForUser(user_id);
			roles.push('standard');
		} else if (newRole === 'blocked' && Roles.userIsInRole(user_id, 'admin')) {
			throw new Meteor.Error("not-authorized");
		} else if (!Roles.userIsInRole(user_id, newRole)) {
			roles = Roles.getRolesForUser(user_id);
			roles.push(newRole);
		} else {
			roles = Roles.getRolesForUser(user_id);
		}

		Roles.setUserRoles(user_id, roles);
	},

	removeRoles: function (user_id, removeRole) {
		check(user_id, String);
		check(removeRole, String);

		if (!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		}

		if (Roles.userIsInRole(user_id, removeRole)) {
			Roles.removeUsersFromRoles(user_id, removeRole);
		}
	}
});
