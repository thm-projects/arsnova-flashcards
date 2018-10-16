//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Notifications} from "../../api/notifications.js";
import "./main.html";
import "../welcome/welcome.js";
import "../wordcloud/wordcloud.js";
import "../impressum/impressum.js";
import "../help/help.js";
import "../cardsets/cardsets.js";
import "../markdeepEditor/navigation/navigation.js";
import "../markdeepEditor/content/content.js";
import "../cardsets/resultItem.js";
import "../cardTypesList/cardTypesList.js";
import "../learn/progress.js";
import "../pool/pool.js";
import "../profile/profile.js";
import "../admin/admin.js";
import "../filter/filter.js";
import "../access_denied/access_denied.js";
import "../first_login/first_login.js";
import "../editor/editor.js";
import "../editor/cardEditor.js";
import "../pomodoroTimer/pomodoroTimer.js";
import "../../api/groundDB.js";
import "../../api/cardIndex.js";
import "./overlays/zoomText.js";
import "../card/sidebar/sidebar.js";
import {Cardsets} from "../../api/cardsets.js";
import {Route} from "../../api/route";
import {CardVisuals} from "../../api/cardVisuals";

Meteor.subscribe("Users");
Meteor.subscribe("notifications");
Meteor.subscribe("adminSettings");
Meteor.subscribe("serverStatistics");

Session.setDefault("theme", "default");
Session.setDefault('activeRouteTitle', '');
Session.setDefault("fullscreen", false);
Session.setDefault("previousRouteName", undefined);
Session.setDefault("connectionStatus", 2);
Session.setDefault("selectingCardsetToLearn", false);
Session.setDefault('helpFilter', undefined);
Session.setDefault('currentZoomValue', CardVisuals.getDefaultTextZoomValue());


function adjustSearchResultWindowSize() {
	if (Meteor.userId()) {
		let destination = $('#input-search');
		let target = $('#searchResults');
		if (destination.length && target.length) {
			let offsetTop = (destination.offset().top + destination.height());
			target.css('max-height', ($(window).height() - offsetTop));
			target.css('left', destination.offset().left);
			target.css('top', offsetTop);
		}
	}
}

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

function setTheme() {
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
	let themeId = "";
	let themeClass = "theme-";
	if (Meteor.userId()) {
		if (Session.get('fullscreen')) {
			themeId = 'theme-wrapper-no-nav';
		} else {
			themeId = 'theme-wrapper';
		}
	} else {
		if (!Session.get('fullscreen')) {
			themeId = 'theme-wrapper-no-nav-welcome';
		} else {
			themeId = 'theme-wrapper-no-nav';
		}
	}
	if (Session.get('theme')) {
		themeClass += Session.get("theme");
	}
	let html = $('html');
	html.attr('id', themeId);
	html.attr('class', themeClass);
}

/** Function provides an reactive callback when a user loggs in and out */
Tracker.autorun(function () {
	connectionStatus();
	setTheme();
});

$(document).on('click', '.navbar-collapse.in', function (e) {
	if ($(e.target).is('a')) {
		$(this).collapse('hide');
	}
});

Template.main.events({
	'click .logout': function (event) {
		event.preventDefault();
		Meteor.logout();
		Session.set('helpFilter', undefined);
	},
	'keyup #input-search': function (event) {
		event.preventDefault();
		Session.set("searchValue", $(event.currentTarget).val());
		if ($(event.currentTarget).val() && CardsetsIndex.search(Session.get("searchValue")).count()) {
			$('#searchDropdown').addClass("open");
		} else {
			$('#searchDropdown').removeClass("open");
		}
		adjustSearchResultWindowSize();
	},
	'click #input-search': function () {
		adjustSearchResultWindowSize();
	},
	'click #searchResults': function () {
		$('#searchDropdown').removeClass("open");
		$('#input-search').val('');
	},
	'click .notificationsBtn': function () {
		var notifications = Notifications.find({read: false, target_type: 'user', target: Meteor.userId()});
		notifications.forEach(function (notification) {
			Meteor.call("setNotificationAsRead", notification._id);
		});
	},
	'click .lang': function (event) {
		event.preventDefault();
		let language = $(event.target).data('lang');
		TAPi18n.setLanguage(language);
		Session.set('activeLanguage', language);
	},
	"click": function (evt) {
		if (!$(evt.target).is('.zoomText'))  {
			CardVisuals.toggleZoomContainer(true);
		}
	}
});

Template.main.helpers({
	checkIfUserIsSelectingACardset: function () {
		if (!Route.isCardset() && !Route.isRepetitorium() && !Route.isPool()) {
			Session.set('selectingCardsetToLearn', false);
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
	searchActive: function () {
		return Session.get("searchValue") !== "" && Session.get("searchValue") !== undefined;
	},
	isActiveProfile: function () {
		if (ActiveRoute.name(/^profile/)) {
			return Router.current().params._id === Meteor.userId();
		}
		return false;
	},
	countNotifications: function () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
			return Notifications.find({}).count();
		} else {
			return Notifications.find({read: false, target_type: 'user', target: Meteor.userId()}).count();
		}
	},
	getLink: function () {
		return "/cardset/" + this.link_id;
	},
	getMyCardsetName: function () {
		switch (Cardsets.find({owner: Meteor.userId()}).count()) {
			case 0:
				return TAPi18n.__('navbar-collapse.noCarddecks');
			case 1:
				return TAPi18n.__('navbar-collapse.oneCarddeck');
			default:
				return TAPi18n.__('navbar-collapse.carddecks');
		}
	},
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit() && !Session.get('fullscreen');
	},
	isNotFirstDemoVisit: function () {
		return (!Route.isFirstTimeVisit() && Route.isDemo());
	},
	getMobileNavbarTitle: function () {
		return Session.get('activeRouteTitle');
	}
});

Template.main.onCreated(function () {
	document.title = Meteor.settings.public.welcome.title.first + "." + Meteor.settings.public.welcome.title.last;
});

Template.main.onRendered(function () {
	Session.set("searchValue", undefined);
	Meteor.call("initUser");
	adjustSearchResultWindowSize();
	$(window).resize(function () {
		adjustSearchResultWindowSize();
	});
	$("html, body").click(function () {
		$('#input-search').val('');
		Session.set("searchValue", undefined);
	});
});

Template.footer.helpers({
	getLanguages: function () {
		const obj = TAPi18n.getLanguages();
		const languages = [];
		for (const key in obj) {
			if (key) {
				languages.push({code: key, label: obj[key]});
			}
		}
		return languages;
	},
	displayFooterNavigation: function () {
		return (Route.isHome() || (Route.isFirstTimeVisit() && Route.isDemo() || Route.isMakingOf()));
	}
});
