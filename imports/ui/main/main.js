//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../util/route";
import {CardVisuals} from "../../util/cardVisuals";
import {MarkdeepContent} from "../../util/markdeep";
import {CardNavigation} from "../../util/cardNavigation";
import {MainNavigation} from "../../util/mainNavigation";
import {ServerStyle} from "../../util/styles.js";
import {AspectRatio} from "../../util/aspectRatio.js";
import * as leitnerStatisticsConfig from "../../config/learningHistory.js";
import "../impressum/modal/statistics/statistics.js";
import "../welcome/welcome.js";
import "../wordcloud/wordcloud.js";
import "../admin/admin.js";
import "../pomodoroTimer/pomodoroTimer.js";
import "../../util/cardIndex.js";
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
import "../notFound/notFound.js";
import "../learningStatistics/modal/status.js";
import "./main.html";
import "../messageOfTheDay/messageOfTheDay.js";

import {PDFViewer} from "../../util/pdfViewer";
import {setLanguage} from "../../startup/client/routes/onBeforeAction.js";
import {Fullscreen} from "../../util/fullscreen";
import {CardsetVisuals} from "../../util/cardsetVisuals";
import tippy from "tippy.js";
import 'tippy.js/animations/scale-extreme.css';
import {BackgroundChanger} from "../../util/backgroundChanger";
import {LockScreen} from "../../util/lockScreen";
import {SweetAlertMessages} from "../../util/sweetAlert";

Meteor.subscribe("notifications");
Meteor.subscribe("serverStatistics");
Meteor.subscribe("collegesCourses");

Session.setDefault("theme", ServerStyle.getDefaultTheme());
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
Session.setDefault('displayMainNavigation', true);

// Session Variables for the Choose Fullscreen Feature
Session.setDefault('fullscreenPresentationSession', 0);
Session.setDefault('fullscreenDemoSession', 0);
Session.setDefault('fullscreenLeitnerSession', 0);
Session.setDefault('fullscreenWozniakSession', 0);
Session.setDefault('activeCardAnswers', []);
Session.setDefault('selectedAnswers', []);

// Cardset bonus history
Session.setDefault('selectedLearningStatistics', undefined);
Session.setDefault('selectedLearningStatisticsUser', undefined);
Session.setDefault('selectedLearningHistory', undefined);
Session.setDefault('selectedLearningLog', undefined);
Session.setDefault('selectedLearningLogStats', undefined);
Session.setDefault('lastLearningStatusActivity', undefined);

// Cardset bonus history sort options
Session.setDefault('sortBonusUsers', leitnerStatisticsConfig.defaultBonusUserSortSettings);
Session.setDefault('sortBonusUserHistory', leitnerStatisticsConfig.defaultUserHistorySortSetting);
Session.setDefault('sortBonusUserTaskHistory', leitnerStatisticsConfig.defaultTaskHistorySortSettings);

Session.setDefault('hideUserNames', true);

// Error Reports
Session.setDefault('activeErrorReport', undefined);
Session.setDefault('errorReportingCard', undefined);
Session.setDefault('errorReportingMode', false);
Session.setDefault('showOnlyErrorReports', false);

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
		if (AspectRatio.isEnabled() || (Route.isPresentation() || Route.isLearningMode())) {
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
			if (Route.isEditMode() && !Fullscreen.isActive()) {
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
let screenResizeSensor;
Template.main.onCreated(function () {
	setLanguage();
	BackgroundChanger.setTheme();
	MarkdeepContent.initializeStylesheet();
	document.title = ServerStyle.getLastAppTitle();
	windowResizeSensor = $(window).resize(function () {
		CardVisuals.resizeFlashcard();
		PDFViewer.resizeIframe();
		LockScreen.resize();
	});
	screenResizeSensor = $(screen).resize(function () {
		CardVisuals.resizeFlashcard();
		PDFViewer.resizeIframe();
		LockScreen.resize();
	});
});

Template.main.onRendered(function () {
	$("html, body").click(function (event) {
		if (!$(event.target).is('.search-dropdown-container *') && !$(event.target).is('#searchResults *')) {
			MainNavigation.clearSearch();
			MainNavigation.closeSearch();
		}
		if (!$(event.target).is('.resultItemHeaderAuthor a') && !$(event.target).is('.cards-filter-element') && !$(event.target).parents('.resultItemHeaderBottomAreaLabels').length) {
			$('.navbar-cards-filter-dropdown').removeClass('active');
			$('.toggle-filter-dropdown').removeClass('active');
		}
	});
	$("#main").click(function () {
		MainNavigation.closeCollapse();
	});
	MainNavigation.initializeNavigation();
	CardsetVisuals.resizeCardsetInfo();
	tippy.setDefaultProps({
		zIndex: 10000,
		animation: 'scale-extreme'
	});
});

Template.main.onDestroyed(function () {
	if (windowResizeSensor !== undefined) {
		windowResizeSensor.off('resize');
	}
	if (screenResizeSensor !== undefined) {
		screenResizeSensor.off('resize');
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

document.addEventListener('fullscreenerror', () => {
	SweetAlertMessages.activateFullscreen();
});
