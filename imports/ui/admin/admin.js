//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Notifications} from "../../api/subscriptions/notifications";
import {MainNavigation} from "../../util/mainNavigation";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./admin.html";
import {Session} from "meteor/session";
import {Fullscreen} from "../../util/fullscreen";

Meteor.subscribe("notifications");

/*
 * ############################################################################
 * admin_main
 * ############################################################################
 */

Template.admin_main.events({
	'click #logout_admin': function (event) {
		event.preventDefault();
		Fullscreen.resetChooseModeSessions();
		MainNavigation.setLoginTarget(false);
		FlowRouter.go('home');
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

Template.admin_main.onCreated(function () {
	Session.set('firedUseCaseModal', true);
});
