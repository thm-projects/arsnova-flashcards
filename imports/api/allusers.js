import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
  Meteor.publish("allUsers", function () {
    if(Roles.userIsInRole(this.userId, 'admin')) {
      return Meteor.users.find({});
    }
  });
}
