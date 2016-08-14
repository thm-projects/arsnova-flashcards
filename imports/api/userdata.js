import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find(
      {$or: [{visible: true}, {_id: this.userId}]},
      {fields: {'profile.name': 1, 'email': 1, 'services': 1, 'lvl': 1, 'visible': 1, 'lastOnAt': 1, 'daysInRow': 1}});
  } else {
    this.ready();
  }
});
}

Meteor.methods({
  updateUsersVisibility: function(visible) {
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        visible: visible
      }
    });
  },
  updateUsersEmail: function(email) {
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        email: email
      }
    });
  },
  initUser: function() {
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        visible: true,
        email: "",
        lvl: 1,
        lastOnAt: new Date(),
        daysInRow: 0
      }
    });
  },
  updateUsersLast: function(id) {
    Meteor.users.update(id, {
      $set: {
        lastOnAt: new Date()
      }
    });
  },
  updateUsersDaysInRow: function(id, row) {
    Meteor.users.update(id, {
      $set: {
        daysInRow: row
      }
    });
  },
  upgradeUser: function () {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, 'standard')) {
      throw new Meteor.Error(403, "Access denied");
    }

    var roles = ['pro'];
    if (Roles.userIsInRole(loggedInUser._id, 'university')) {
      roles.push('university');
    }
    if (Roles.userIsInRole(loggedInUser._id, 'lecturer')) {
      roles.push('lecturer');
    }

    Roles.setUserRoles(loggedInUser._id, roles);
  },
  downgradeUser: function () {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, 'pro')) {
      throw new Meteor.Error(403, "Access denied");
    }

    var roles = ['standard'];
    if (Roles.userIsInRole(loggedInUser._id, 'university')) {
      roles.push('university');
    }
    if (Roles.userIsInRole(loggedInUser._id, 'lecturer')) {
      roles.push('lecturer');
    }

    Roles.setUserRoles(loggedInUser._id, roles);
  }
});
