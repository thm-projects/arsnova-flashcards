import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection("notifications");

if (Meteor.isServer) {
  Meteor.publish("notifications", function() {
    if (this.userId)
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
    }
  });

  Notifications.attachSchema(NotificationSchema);
}

Meteor.methods({
  addNotification: function(target, type, text, link_id) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (target === 'lecturer') {
      var lecturers = Roles.getUsersInRole('lecturer');
      lecturers.forEach(function (lecturer) {
        Meteor.call("createNotification", lecturer._id, type, text, link_id);
      });
    } else if (target === 'admin') {
      var admins = Roles.getUsersInRole('admin', 'editor');
      admins.forEach(function (admin) {
        Meteor.call("createNotification", admin._id, type, text, link_id);
      });
    } else {
      Meteor.call("createNotification", target, type, text, link_id);
    }
  },

  createNotification: function(target, type, text, link_id) {
    Notifications.insert({
      target: target,
      origin: Meteor.userId(),
      type: type,
      text: text,
      date: new Date(),
      read: false,
      cleared: false,
      link_id: link_id
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
  },
});
