import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { UserPermissions } from '../../util/permissions';

Meteor.methods({
  updateUser(userId, visible, email, blockedText) {
    check(userId, String);
    check(visible, Boolean);
    check(email, String);
    check(blockedText, String);

    if (UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update(userId, {
      $set: {
        visible,
        email,
        blockedtext: blockedText,
      },
    });
  },
  updateRoles(userId, newRole) {
    check(userId, String);
    check(newRole, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }

    let roles;

    if (newRole === 'pro' && !Roles.userIsInRole(userId, 'pro')) {
      Roles.removeUsersFromRoles(userId, 'standard');
      roles = Roles.getRolesForUser(userId);
      roles.push('pro');
    } else if (newRole === 'standard' && !Roles.userIsInRole(userId, 'standard')) {
      Roles.removeUsersFromRoles(userId, 'pro');
      roles = Roles.getRolesForUser(userId);
      roles.push('standard');
    } else if (newRole === 'blocked' && Roles.userIsInRole(userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(userId, newRole)) {
      roles = Roles.getRolesForUser(userId);
      roles.push(newRole);
    } else {
      roles = Roles.getRolesForUser(userId);
    }

    Roles.setUserRoles(userId, roles);
  },

  removeRoles(userId, removeRole) {
    check(userId, String);
    check(removeRole, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }

    if (Roles.userIsInRole(userId, removeRole)) {
      Roles.removeUsersFromRoles(userId, removeRole);
    }
  },
});
