//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../api/route";
import {CardVisuals} from "../../api/cardVisuals";
import {MarkdeepContent} from "../../api/markdeep";
import {CardNavigation} from "../../api/cardNavigation";
import {MainNavigation} from "../../api/mainNavigation";
import {ServerStyle} from "../../api/styles.js";
import {AspectRatio} from "../../api/aspectRatio.js";
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
import "./overlays/aspectRatio.js";
import "./overlays/zoomText.js";
import "../card/sidebar/sidebar.js";
import "../loadingScreen/loadingScreen.js";
import "../card/editor/editor.js";
import "./item/searchResult.js";
import "./modal/item/closeIcon.js";
import "./navigation/navigation.js";
import "../useCases/useCases.js";
import "./main.html";
import "./modal/arsnovaClick.js";
import "./modal/arsnovaLite.js";
import "./modal/connectionStatus.js";
import "./modal/underDevelopment.js";

Meteor.subscribe("notifications");
Meteor.subscribe("adminSettings");
Meteor.subscribe("serverStatistics");

Session.setDefault("theme", "default");
Session.setDefault("fullscreen", false);
Session.setDefault("previousRouteName", undefined);
Session.setDefault("connectionStatus", 2);
Session.setDefault("selectingCardsetToLearn", false);
Session.setDefault('helpFilter', undefined);
Session.setDefault('currentZoomValue', CardVisuals.getDefaultTextZoomValue());
Session.setDefault('demoFullscreen', false);
Session.setDefault('isConnectionModalOpen', false);
Session.setDefault('hideSidebar', false);
Session.setDefault('aspectRatioContainerVisible', false);
Session.setDefault('aspectRatioMode', 0);
Session.setDefault('firedUseCaseModal', 0);

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
Tracker.autorun(function () {
	Meteor.subscribe('personalUserData');
	connectionStatus();
});

$(document).on('click', '.navbar-collapse.in', function (e) {
	if ($(e.target).is('a')) {
		$(this).collapse('hide');
	}
});

Template.main.events({
	"click": function (evt) {
		if (!$(evt.target).is('.zoomText')) {
			CardVisuals.toggleZoomContainer(true);
		}
		if (!$(evt.target).is('.aspect-ratio-button')) {
			CardVisuals.toggleAspectRatioContainer(true);
		}
	}
});

Template.main.helpers({
	checkIfUserIsSelectingACardset: function () {
		if (!Route.isCardset() && !Route.isRepetitorium() && !Route.isPool()) {
			Session.set('selectingCardsetToLearn', false);
		}
	},
	getUsername: function () {
		if (Meteor.user()) {
			return Meteor.user().profile.name;
		}
	},
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit() && !Session.get('fullscreen');
	},
	isNotFirstDemoVisit: function () {
		return (!Route.isFirstTimeVisit() && Route.isDemo());
	},
	getMainContainer: function () {
		if (AspectRatio.isEnabled()) {
			if (Route.isTableOfContent()) {
				return "container";
			} else {
				if (Session.get('hideSidebar')) {
					return "presentation-container-no-sidebar";
				} else {
					return "presentation-container";
				}
			}
		} else if (Route.isHome() && !Meteor.user() && !MainNavigation.isGuestLoginActive()) {
			return "";
		} else if (Route.isEditMode() || Route.isCardsetLeitnerStats() || Route.isTranscriptBonus()) {
			if (Route.isEditMode() && !CardVisuals.isFullscreen()) {
				return "container-fluid-editor";
			} else {
				return "container-fluid";
			}
		} else if (Route.isFirstTimeVisit() && !MainNavigation.isGuestLoginActive()) {
			return "";
		} else {
			return "container";
		}
	}
});

Template.main.onCreated(function () {
	MarkdeepContent.initializeStylesheet();
	document.title = ServerStyle.getLastAppTitle();
});

Template.main.onRendered(function () {
	Meteor.call("initUser");
	$("html, body").click(function (event) {
		if (!$(event.target).is('.search-dropdown-container .cards-search-element') && !$(event.target).is('#searchResults .cards-search-element')) {
			MainNavigation.clearSearch();
			$('.navbar-cards-search-dropdown').removeClass('active');
		}
		if (!$(event.target).is('.resultItemHeaderAuthor a') && !$(event.target).is('.cards-filter-element') && !$(event.target).parents('.resultItemHeaderBottomAreaLabels').length) {
			$('.navbar-cards-filter-dropdown').removeClass('active');
		}
	});
	$("#main").click(function () {
		MainNavigation.closeCollapse();
	});
	MainNavigation.initializeNavigation();
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

