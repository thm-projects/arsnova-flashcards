import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Cardsets } from './cardsets.js';

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
Meteor.publish("privateUserData", function () {
  if (this.userId) {
    return Meteor.users.find(
      {_id: this.userId},
      {fields: {'profile.name': 1, 'email': 1, 'services': 1, 'lvl': 1, 'visible': 1, 'lastOnAt': 1, 'daysInRow': 1, 'balance': 1}});
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
  updateUsersName: function(name) {
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        profile: {name: name}
      }
    });
    Cardsets.update({ owner: Meteor.user()._id }, {
      $set: {
        username: name
      }
    }, {multi:true});
  },
  checkUsersName: function(name) {
    var userExists = Meteor.users.findOne({"profile.name": name});
    if (userExists && userExists._id !== this.userId) {
      throw new Meteor.Error("username already exists");
    }
    return name;
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
  increaseUsersBalance: function(user_id, lecturer_id, amount) {
    if (amount < 10) {
      var user_amount = Math.round((amount * 0.7) * 100) / 100;
      var lecturer_amount = Math.round((amount * 0.05) * 100) / 100;

      Meteor.users.update(user_id, {$inc: {balance: user_amount}});
      Meteor.users.update(lecturer_id, {$inc: {balance: lecturer_amount}});
    } else {
      throw new Meteor.Error("Amount of money is too high");
    }
  },
});
