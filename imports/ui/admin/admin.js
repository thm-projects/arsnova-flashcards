//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Notifications} from "../../api/notifications.js";
import {MainNavigation} from "../../api/mainNavigation";
import "./admin.html";
import "./dashboard/dashboard.js";
import "./users/index.js";
import "./learningStatistics/learningStatistics.js";
import "./apiAccess/apiAccess.js";
import "./notifications/notifications.js";
import "./university/university.js";
import "./settings/settings.js";
import "../learn/progress.js";


Meteor.subscribe("notifications");

/*
 * ############################################################################
 * admin_main
 * ############################################################################
 */

Template.admin_main.events({
	'click #logout_admin': function (event) {
		event.preventDefault();
		MainNavigation.setLoginTarget(false);
		Meteor.logout();
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
