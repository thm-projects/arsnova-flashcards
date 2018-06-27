//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Notifications} from "../../api/notifications.js";
import "./main.html";
import "../welcome/welcome.js";
import "../impressum/impressum.js";
import "../cardsets/cardsets.js";
import "../markdeepEditor/navigation/navigation.js";
import "../markdeepEditor/content/content.js";
import "../cardsetCourseIterations/results.js";
import "../cardTypesList/cardTypesList.js";
import "../courseIterations/coursesIterations.js";
import "../learn/progress.js";
import "../pool/pool.js";
import "../profile/profile.js";
import "../admin/admin.js";
import "../access_denied/access_denied.js";
import "../first_login/first_login.js";
import "../editor/editor.js";
import "../editor/cardEditor.js";
import "../../api/groundDB.js";
import "../../api/cardIndex.js";
import {Cardsets} from "../../api/cardsets.js";

Meteor.subscribe("Users");
Meteor.subscribe("notifications");
Meteor.subscribe("adminSettings");

Session.setDefault("theme", "default");
Session.setDefault("fullscreen", false);
Session.setDefault("previousRouteName", undefined);
Session.setDefault("connectionStatus", 2);
Session.setDefault("selectingCardsetToLearn", false);
Session.setDefault('helpTarget', undefined);


function adjustSearchResultWindowSize() {
	if (Meteor.userId()) {
		let destination = $('#input-search');
		let target = $('#searchResults');
		if (destination !== undefined && target !== undefined) {
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
	'click #helpBtn': function (event) {
		event.preventDefault();
		let activeRouteName = Router.current().route.getName();
		if (activeRouteName === "box" || activeRouteName === "memo") {
			Router.go('learning');
		} else {
			let target = "#";
			switch (Router.current().route.getName()) {
				case "cardsetdetailsid":
					target += "cardset";
					break;
				case "cardseteditors":
					target += "cardsetEditors";
					break;
				case "cardsetlist":
					target += "cardset";
					break;
				case "cardsetstats":
					target += "progressCardset";
					break;
				case "create":
					target += "createCardset";
					break;
				case "courseIterations":
					target += "courseIterations";
					break;
				case "editCard":
					target += "editCard";
					break;
				case "learn":
					target += "studyWorkload";
					break;
				case "pool":
					target += "pool";
					break;
				case "profileOverview":
					target += "profileOverview";
					break;
				case "profileMembership":
					target += "profileMembership";
					break;
				case "profileBilling":
					target += "profileBilling";
					break;
				case "profileNotifications":
					target += "profileNotifications";
					break;
				case "profileSettings":
					target += "profileSettings";
					break;
				case "profileRequests":
					target += "profileRequests";
					break;
				case "progress":
					target += "progressUser";
					break;
				case "shuffle":
					target += "shuffle";
					break;
				default:
					target = "";
			}
			target += "Help";
			Session.set('helpTarget', target);
			Router.go('help');
		}
	},
	'click .logout': function (event) {
		event.preventDefault();
		Meteor.logout();
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
	}
});

Template.main.helpers({
	getTheme: function () {
		if (Session.get('theme')) {
			if (Session.get('theme') === "default" && Router.current().route.getName() !== "presentation" && Router.current().route.getName() !== "presentationlist") {
				$("html").css("background-image", "url('/img/background/zettelkasten_wikipedia.jpg')");
			} else {
				$("html").css("background-image", "none");
			}
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
		return Notifications.find({read: false, target_type: 'user', target: Meteor.userId()}).count();
	},
	getNotifications: function () {
		return Notifications.find({cleared: false, target_type: 'user', target: Meteor.userId()}, {sort: {date: -1}});
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
	}
});
