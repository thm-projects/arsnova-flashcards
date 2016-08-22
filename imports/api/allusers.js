import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Cardsets } from './cardsets.js';

if (Meteor.isServer) {
  Meteor.publish("allUsers", function () {
    if(Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      return Meteor.users.find({});
    }
  });
}

Meteor.methods({
  updateUser: function(user_id, visible, email) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error("not-authorized");
    }

    Meteor.users.update(user_id, {
      $set: {
        visible: visible,
        email: email
      }
    });
  },
  deleteUser: function(user_id) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error("not-authorized");
    }

    Meteor.users.remove(user_id);
    Cardsets.update({ owner: user_id }, {
      $set: {
        username: 'deleted'
      }
    });
  },
  updateRoles: function(user_id, newRole) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error("not-authorized");
    }

    var roles = [];

    if (newRole === 'pro' && !Roles.userIsInRole(user_id, 'pro')) {
      Roles.removeUsersFromRoles(user_id, 'standard'),
      roles = Roles.getRolesForUser(user_id);
      roles.push('pro');
    } else if (newRole === 'standard' && !Roles.userIsInRole(user_id, 'standard')) {
      Roles.removeUsersFromRoles(user_id, 'pro'),
      roles = Roles.getRolesForUser(user_id);
      roles.push('standard');
    } else if (!Roles.userIsInRole(user_id, newRole)) {
      roles = Roles.getRolesForUser(user_id);
      roles.push(newRole);
    } else {
      roles = Roles.getRolesForUser(user_id);
    }

    Roles.setUserRoles(user_id, roles);
  },

  removeRoles: function(user_id, removeRole) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error("not-authorized");
    }

    if (Roles.userIsInRole(user_id, removeRole)) {
      Roles.removeUsersFromRoles(user_id, removeRole);
    }
  }
});
