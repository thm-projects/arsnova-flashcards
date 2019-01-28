//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Notifications} from "../../api/notifications.js";
import {Route} from "../../api/route";
import {CardVisuals} from "../../api/cardVisuals";
import {MarkdeepContent} from "../../api/markdeep";
import {CardNavigation} from "../../api/cardNavigation";
import {MainNavigation} from "../../api/mainNavigation";
import "../welcome/welcome.js";
import "../wordcloud/wordcloud.js";
import "../impressum/impressum.js";
import "../help/help.js";
import "../filter/index/index.js";
import "../markdeep/editor/navigation/navigation.js";
import "../markdeep/editor/content/content.js";
import "../filter/index/item/cardset.js";
import "../cardTypesList/cardTypesList.js";
import "../learn/progress.js";
import "../profile/profile.js";
import "../admin/admin.js";
import "../filter/filter.js";
import "../accessDenied/accessDenied.js";
import "../firstLogin/firstLogin.js";
import "../pomodoroTimer/pomodoroTimer.js";
import "../../api/cardIndex.js";
import "./overlays/zoomText.js";
import "../card/sidebar/sidebar.js";
import "../loadingScreen/loadingScreen.js";
import "../card/editor/editor.js";
import "./item/search.js";
import "./main.html";

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
Session.setDefault('demoFullscreen', false);
Session.setDefault('isConnectionModalOpen', false);

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
		Session.set('helpFilter', undefined);
		MainNavigation.setLoginTarget(false);
		Meteor.logout();
	},
	'click #searchResults': function () {
		$('.searchDropdown').removeClass("open");
		$('.input-search').val('');
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
		if (Meteor.user() && Meteor.user().count !== undefined) {
			switch (Meteor.user().count.cardsets) {
				case 0:
					return TAPi18n.__('navbar-collapse.noCarddecks');
				case 1:
					return TAPi18n.__('navbar-collapse.oneCarddeck');
				default:
					return TAPi18n.__('navbar-collapse.carddecks');
			}
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
	MarkdeepContent.initializeStylesheet();
	document.title = Meteor.settings.public.welcome.title.first + "." + Meteor.settings.public.welcome.title.last;
});

Template.main.onRendered(function () {
	Meteor.call("initUser");
	$("html, body").click(function () {
		$('.input-search').val('');
		Session.set("searchValue", undefined);
		Session.set('searchCategoriesResult', []);
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

Meteor.startup(function () {
	CardNavigation.fullscreenExitEvents();
	$(document).on('keydown', function (event) {
		MainNavigation.keyEvents(event);
		CardNavigation.keyEvents(event);
	});
	$(document).on('keyup', function () {
		MainNavigation.enableKeyEvents();
		CardNavigation.enableKeyEvents();
	});
});

Template.connectionStatus.helpers({
	isModalOpen: function () {
		return Session.get('isConnectionModalOpen');
	}
});


Template.connectionStatusModal.onRendered(function () {
	$('#connectionStatusModal').on('hidden.bs.modal', function () {
		Session.set('isConnectionModalOpen', false);
	});
	$('#connectionStatusModal').on('shown.bs.modal', function () {
		Session.set('isConnectionModalOpen', true);
	});
});
