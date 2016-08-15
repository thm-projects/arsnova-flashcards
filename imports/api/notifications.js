import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection("notifications");

if (Meteor.isServer) {
  Meteor.publish("notifications", function() {
    if (Roles.userIsInRole(this.userId, 'admin-user')) {
      return Notifications.find({target: {$in: [this.userId, "admin"]}});
    }
    else if (this.userId)
    {
      return Notifications.find({target: this.userId});
    }
  });

  var NotificationSchema = new SimpleSchema({
    target: {
      type: String
    },
    origin: {
      type: String
    },
    type: {
      type: String
    },
    text: {
      type: String
    },
    date: {
      type: String
    },
    read: {
      type: Boolean
    },
    cleared: {
      type: Boolean
    },
  });

  Notifications.attachSchema(NotificationSchema);
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
      read: false,
      cleared: false
    });
  }
});
