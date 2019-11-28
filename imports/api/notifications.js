import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Notifications} from "./subscriptions/notifications";

Meteor.methods({
	addNotification: function (target, type, text, link_id, receiver) {
		check(target, String);
		check(type, String);
		check(text, String);
		check(link_id, String);
		check(receiver, String);

		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (target === 'lecturer') {
			var lecturers = Roles.getUsersInRole('lecturer');
			lecturers.forEach(function (lecturer) {
				Meteor.call("createNotification", lecturer._id, type, text, link_id, 'stats.js', receiver);
			});
		} else if (target === 'admin') {
			var admins = Roles.getUsersInRole([
				'admin',
				'editor'
			]);
			admins.forEach(function (admin) {
				Meteor.call("createNotification", admin._id, type, text, link_id, 'admin', receiver);
			});
		} else {
			Meteor.call("createNotification", target, type, text, link_id, 'stats.js', receiver);
		}
	},

	createNotification: function (target, type, text, link_id, target_type, receiver) {
		check(target, String);
		check(type, String);
		check(text, String);
		check(link_id, String);
		check(target_type, String);
		check(receiver, String);

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

	setNotificationAsRead: function (notification_id) {
		check(notification_id, String);

		Notifications.update(notification_id, {
			$set: {
				read: true
			}
		});
	},

	setNotificationAsCleared: function (notification_id) {
		check(notification_id, String);

		Notifications.update(notification_id, {
			$set: {
				cleared: true
			}
		});
	},

	deleteNotification: function (notification_id) {
		Notifications.remove(notification_id);
	}
});
