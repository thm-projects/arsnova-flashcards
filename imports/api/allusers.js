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
  }
});
