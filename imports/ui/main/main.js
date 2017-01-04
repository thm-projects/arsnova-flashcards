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
import "../../api/groundDB.js";

Meteor.subscribe("Users");
Meteor.subscribe("notifications");
Meteor.subscribe("adminSettings");


Session.setDefault("theme", "default");

// Check if user is logged in and load the selectedColorTheme
Meteor.autorun(function () {
    if (Meteor.userId()) {
        // If there is no selectedColorTheme the Session var "theme" will stay NULL.
        Session.set("theme", Meteor.users.findOne(Meteor.userId()).selectedColorTheme);
    }
});

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
	},
	'click .lang': function (event) {
		event.preventDefault();
		TAPi18n.setLanguage($(event.target).data('lang'));
	}
});

Template.main.helpers({
	getTheme: function () {
        if (Session.get('theme')){
            return "theme-" + Session.get("theme");
		}
	},
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
	},
	getLanguages: function () {
		const obj = TAPi18n.getLanguages();
		const languages = [];
		for (const key in obj) {
			if (key) {
				languages.push({code: key, label: obj[key]});
			}
		}
		if (languages) {
			return languages;
		}
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