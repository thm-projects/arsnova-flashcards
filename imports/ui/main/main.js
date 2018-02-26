//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Notifications} from "../../api/notifications.js";
import "./main.html";
import "../welcome/welcome.js";
import "../impressum/impressum.js";
import "../cardsets/cardsets.js";
import "../courseIterations/coursesIterations.js";
import "../learn/progress.js";
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
Session.setDefault("fullscreen", false);
Session.setDefault("previousRouteName", undefined);
Session.setDefault("connectionStatus", 2);
Session.setDefault("selectingCardsetToLearn", false);


function connectionStatus() {
	let stat;
	if (Meteor.status().status === "connected") {
		stat = 1;
	} else if (Meteor.status().status === "connecting") {
		stat = 2;
	} else {
		stat = 0;
	}
	Session.set('connectionStatus', stat);
}

/** Function provides an reactive callback when a user loggs in and out */
Meteor.autorun(function () {
	if (Meteor.userId()) {
		// If there is no selectedColorTheme the Session var "theme" will stay NULL.
		if (Meteor.users.findOne(Meteor.userId())) {
			if (Meteor.users.findOne(Meteor.userId()).selectedColorTheme) {
				Session.set("theme", Meteor.users.findOne(Meteor.userId()).selectedColorTheme);
			}
		}
	} else {
		// When user logged out, go back to default Theme
		Session.set('theme', "default");
	}
	connectionStatus();
});

$(document).on('click', '.navbar-collapse.in', function (e) {
	if ($(e.target).is('a')) {
		$(this).collapse('hide');
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
		let language = $(event.target).data('lang');
		TAPi18n.setLanguage(language);
		Session.set('activeLanguage', language);
	}
});

Template.main.helpers({
	getTheme: function () {
		if (Session.get('theme')) {
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

		return languages;
	}
});

Template.main.onRendered(function () {
	Session.set("searchValue", undefined);
	Meteor.call("initUser");
});

Template.completeProfileModal.events({
	"click #completeProfileGoToProfile": function () {
		$('#completeProfileModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#completeProfileModal').on('hidden.bs.modal', function () {
			Router.go('profileSettings', {
				_id: Meteor.userId()
			});
		});
	}
});
