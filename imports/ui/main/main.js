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
import "../impressum/modal/statistics/statistics.js";
import "../welcome/welcome.js";
import "../wordcloud/wordcloud.js";
import "../admin/admin.js";
import "../pomodoroTimer/pomodoroTimer.js";
import "../../api/cardIndex.js";
import "../loadingScreen/loadingScreen.js";
import "./item/searchResult.js";
import "./modal/item/closeIcon.js";
import "./navigation/navigation.js";
import "../useCases/useCases.js";
import "../cardTypesList/cardTypesList.js";
import "./modal/connectionStatus.js";
import "./modal/underDevelopment.js";
import "./modal/pdfViewer.js";
import "../accessDenied/accessDenied.js";
import "../learn/modal/progress.js";
import "./main.html";

import {PDFViewer} from "../../util/pdfViewer";
import {setLanguage, setTheme} from "../../startup/client/routes";

Meteor.subscribe("notifications");
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
Session.setDefault('isAnswerEditorEnabled', false);

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

let windowResizeSensor;
Template.main.onCreated(function () {
	setLanguage();
	setTheme();
	MarkdeepContent.initializeStylesheet();
	document.title = ServerStyle.getLastAppTitle();
	windowResizeSensor = $(window).resize(function () {
		CardVisuals.resizeFlashcard();
		PDFViewer.resizeIframe();
	});
});

Template.main.onRendered(function () {
	Meteor.call("initUser");
	$("html, body").click(function (event) {
		if (!$(event.target).is('.search-dropdown-container *') && !$(event.target).is('#searchResults *')) {
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

Template.main.onDestroyed(function () {
	if (windowResizeSensor !== undefined) {
		windowResizeSensor.off('resize');
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

