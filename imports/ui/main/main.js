//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Notifications} from "../../api/notifications.js";
import "./main.html";
import "../welcome/welcome.js";
import "../impressum/impressum.js";
import "../cardsets/cardsets.js";
import "../pool/pool.js";
import "../profile/profile.js";
import "../admin/admin.js";
import "../access_denied/access_denied.js";
import "../first_login/first_login.js";

Meteor.subscribe("Users");
Meteor.subscribe("notifications");
Meteor.subscribe("adminSettings");

Template.main.events({
	'click #logout': function (event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('home');
	},
	'keyup #input-search': function (event) {
		event.preventDefault();
		Session.set("searchValue", $(event.currentTarget).val());
		if ($(event.currentTarget).val() && CardsetsIndex.search(Session.get("searchValue")).count()) {
			$('#searchDropdown').addClass("open");
		} else {
			$('#searchDropdown').removeClass("open");
		}
	},
	'click #searchResults': function () {
		$('#searchDropdown').removeClass("open");
		$('#input-search').val('');
	},
	'click #notificationsBtn': function () {
		var notifications = Notifications.find({read: false, target_type: 'user', target: Meteor.userId()});
		notifications.forEach(function (notification) {
			Meteor.call("setNotificationAsRead", notification._id);
		});
	},
	'click #clearBtn': function () {
		var notifications = Notifications.find({cleared: false, target_type: 'user', target: Meteor.userId()});
		notifications.forEach(function (notification) {
			Meteor.call("setNotificationAsCleared", notification._id);
		});
	}
});

Template.main.helpers({
	getYear: function () {
		return moment(new Date()).format("YYYY");
	},
	getUsername: function () {
		if (Meteor.user()) {
			return Meteor.user().profile.name;
		}
	},
	searchCategories: function () {
		if (Session.get("searchValue")) {
			return CardsetsIndex.search(Session.get("searchValue")).fetch();
		} else {
			return undefined;
		}
	},
	isActiveProfile: function () {
		if (ActiveRoute.name(/^profile/)) {
			return Router.current().params._id === Meteor.userId();
		}
		return false;
	},
	countNotifications: function () {
		return Notifications.find({read: false, target_type: 'user', target: Meteor.userId()}).count();
	},
	getNotifications: function () {
		return Notifications.find({cleared: false, target_type: 'user', target: Meteor.userId()}, {sort: {date: -1}});
	},
	getLink: function () {
		return "/cardset/" + this.link_id;
	}
});

Template.main.onRendered(function () {
	Session.set("searchValue", undefined);

	var user = Meteor.users.findOne({
		_id: Meteor.userId(),
		lvl: {
			$exists: false
		}
	});

	if (user !== undefined) {
		Meteor.call("initUser");
	}
});
