//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Notifications} from '../../api/notifications.js';

import './admin.html';

import './admin_dashboard/admin_dashboard.js';
import './admin_cardsets/admin_cardsets.js';
import './admin_cards/admin_cards.js';
import './admin_users/admin_users.js';
import './admin_notifications/admin_notifications.js';


Meteor.subscribe("notifications");

/**
 * ############################################################################
 * admin_main
 * ############################################################################
 */

Template.admin_main.events({
	'click #logout_admin': function (event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('home');
	},
	'click #notificationsBtn_admin': function () {
		var notifications = Notifications.find({
			read: false,
			target_type: 'admin',
			target: Meteor.userId()
		});
		notifications.forEach(function (notification) {
			Meteor.call("setNotificationAsRead", notification._id);
		});
	},
	'click #clearBtn_admin': function () {
		var notifications = Notifications.find({
			cleared: false,
			target_type: 'admin',
			target: Meteor.userId()
		});
		notifications.forEach(function (notification) {
			Meteor.call("setNotificationAsCleared", notification._id);
		});
	}
});

Template.admin_main.helpers({
	getUsername: function () {
		if (Meteor.user()) {
			return Meteor.user().profile.name;
		}
	},
	countNotifications: function () {
		return Notifications.find({
			read: false,
			target_type: 'admin',
			target: Meteor.userId()
		}).count();
	},
	getNotifications: function () {
		return Notifications.find({
			cleared: false,
			target_type: 'admin',
			target: Meteor.userId()
		}, {sort: {date: -1}});
	},
	getLink: function () {
		if (this.type === "Adminbenachrichtigung (Gemeldeter Kartensatz)" || this.type === "Gemeldeter Kartensatz") {
			return "/admin/cardset/" + this.link_id;
		} else {
			return "/admin/user/" + this.link_id;
		}
	}
});
