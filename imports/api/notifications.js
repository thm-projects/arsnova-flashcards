import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection("notifications");

if (Meteor.isServer) {
  Meteor.publish("notifications", function() {
    if (this.userId) {
      return Notifications.find({target: this.userId});
    }
  });
}

Meteor.methods({
  addNotification: function(target, type, text) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Notifications.insert({
      target: target,
      origin: Meteor.userId(),
      type: type,
      text: text,
      date: new Date(),
    });
  }
});
