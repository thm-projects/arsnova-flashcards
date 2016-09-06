import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection("notifications");

if (Meteor.isServer) {
  Meteor.publish("notifications", function() {
    if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
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
      type: Date
    },
    read: {
      type: Boolean
    },
    cleared: {
      type: Boolean
    },
    link_id: {
      type: String
    },
    target_type: {
      type: String
    },
    receiver: {
      type: String
    }
  });

  Notifications.attachSchema(NotificationSchema);
}

Meteor.methods({
  addNotification: function(target, type, text, link_id, receiver) {
    // Make sure the user is logged in
    if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
      throw new Meteor.Error("not-authorized");
    }
    if (target === 'lecturer') {
      var lecturers = Roles.getUsersInRole('lecturer');
      lecturers.forEach(function (lecturer) {
        Meteor.call("createNotification", lecturer._id, type, text, link_id, 'user', receiver);
      });
    } else if (target === 'admin') {
      var admins = Roles.getUsersInRole(['admin', 'editor']);
      admins.forEach(function (admin) {
        Meteor.call("createNotification", admin._id, type, text, link_id, 'admin', receiver);
      });
    } else {
      Meteor.call("createNotification", target, type, text, link_id, 'user', receiver);
    }
  },

  createNotification: function(target, type, text, link_id, target_type, receiver) {
    Notifications.insert({
      target: target,
      origin: Meteor.userId(),
      type: type,
      text: text,
      date: new Date(),
      read: false,
      cleared: false,
      link_id: link_id,
      target_type: target_type,
      receiver: receiver
    });
  },

  setNotificationAsRead: function(notification_id) {
    Notifications.update(notification_id, {
      $set: {
        read: true
      }
    });
  },

  setNotificationAsCleared: function(notification_id) {
    Notifications.update(notification_id, {
      $set: {
        cleared: true
      }
    });
  },

  deleteNotification: function(notification_id) {
    Notifications.remove(notification_id);
  }
});
