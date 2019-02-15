//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../api/route.js";
import {getUserLanguage} from "../../startup/client/i18n";
import {ReactiveVar} from 'meteor/reactive-var';
import "./welcome.html";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import * as fakeInventory from '../../../public/fakeStatistics/inventory.json';
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {CardVisuals} from "../../api/cardVisuals";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {AdminSettings} from "../../api/adminSettings";
import {WordcloudCanvas} from "../../api/wordcloudCanvas";
import {ServerStyle} from "../../api/styles.js";

Meteor.subscribe("pomodoroLandingPage");
Meteor.subscribe("userData");
Meteor.subscribe("serverInventory");

function setActiveLanguage() {
	let language = getUserLanguage();
	TAPi18n.setLanguage(language);
	Session.set('activeLanguage', language);
}

function splitLargeNumbers(number) {
	let separator;
	if (Session.get('activeLanguage') === "de") {
		separator = ".";
	} else {
		separator = ",";
	}
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function getLoginClass() {
	if (NavigatorCheck.isEdge()) {
		return "login-button-legacy-icon";
	} else {
		return "login-button-icon";
	}
}

//------------------------ LOGIN EVENT

Template.welcome.events({
	'click #facebook': function () {
		Meteor.loginWithFacebook({}, function (err) {
			if (err) {
				throw new Meteor.Error("Facebook login failed");
			} else {
				setActiveLanguage();
			}
		});
	},

	'click #twitter': function () {
		Meteor.loginWithTwitter({}, function (err) {
			if (err) {
				throw new Meteor.Error("Twitter login failed");
			} else {
				setActiveLanguage();
			}
		});
	},

	'click #google': function () {
		Meteor.loginWithGoogle({}, function (err) {
			if (err) {
				throw new Meteor.Error("Google login failed");
			} else {
				setActiveLanguage();
			}
		});
	},

	'click #cas': function () {
		Meteor.loginWithCas(function (err) {
			if (err) {
				throw new Meteor.Error("CAS login failed");
			} else {
				setActiveLanguage();
			}
		});
	},

	// Backdoor for login in acceptance tests
	'click #BackdoorLogin': function () {
		if (Meteor.settings.public.backdoorEnabled) {
			Meteor.insecureUserLogin($("#TestingBackdoorUsername").val(), function (err, result) {
				if (result) {
					setActiveLanguage();
				}
			});
		}
	},

	'click #logout': function () {
		Meteor.logout(function (err) {
			if (err) {
				throw new Meteor.Error("Logout failed");
			}
		});
	}
});

Template.welcome.helpers({
	getLoginButtons: function () {
		let loginButtons = "<div id='loginButtonRow'>";
		if (ServerStyle.isLoginEnabled("legacy")) {
			if (ServerStyle.isLoginEnabled("cas")) {
				loginButtons += '<a id="cas" href=""><div class="' + getLoginClass() + '"></div></a>';
			}
			if (ServerStyle.isLoginEnabled("facebook")) {
				loginButtons += '<a id="facebook" href=""><div class="' + getLoginClass() + '"></div></a>';
			}
			if (ServerStyle.isLoginEnabled("twitter")) {
				loginButtons += '<a id="twitter" href=""><div class="' + getLoginClass() + '"></div></a>';
			}
			if (ServerStyle.isLoginEnabled("google")) {
				loginButtons += '<a id="google" href=""><div class="' + getLoginClass() + '"></div></a>';
			}
		} else {
			if (ServerStyle.isLoginEnabled("cas")) {
				loginButtons += '<button id="cas" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.cas") + '"><span class="flex-content"><i class="fa fa-university"></i>&nbsp;' + TAPi18n.__("landingPage.login.cas") + '</span></button>';
			}
			if (ServerStyle.isLoginEnabled("guest")) {
				loginButtons += '<button id="guest" class="btn btn-large btn-raised btn-block" data-toggle="modal" data-target="#underDevelopmentModal" title="' + TAPi18n.__("landingPage.login.tooltip.guest") + '"><span class="flex-content"><i class="fa fa-user"></i>&nbsp;' + TAPi18n.__("landingPage.login.guest") + '</span></button>';
			}
			if (ServerStyle.isLoginEnabled("pro")) {
				loginButtons += '<button id="pro" class="btn btn-large btn-raised btn-block" data-toggle="modal" data-target="#underDevelopmentModal" title="' + TAPi18n.__("landingPage.login.tooltip.pro") + '"><span class="flex-content"><i class="fa fa-paypal"></i>&nbsp;' + TAPi18n.__("landingPage.login.pro") + '</span></button>';
			}
		}
		// Backdoor for login in acceptance tests
		if (ServerStyle.isLoginEnabled("backdoor")) {
			let title = TAPi18n.__("backdoor.title");
			let superAdmin = TAPi18n.__("backdoor.superAdmin");
			let admin = TAPi18n.__("backdoor.admin");
			let pro = TAPi18n.__("backdoor.pro");
			let lecturer = TAPi18n.__("backdoor.lecturer");
			let edu = TAPi18n.__("backdoor.edu");
			let standard = TAPi18n.__("backdoor.standard");
			let blocked = TAPi18n.__("backdoor.blocked");
			let firstLogin = TAPi18n.__("backdoor.firstLogin");
			if (ServerStyle.isLoginEnabled("legacy")) {
				loginButtons += '<a id="BackdoorLogin" href=""><div class="' + getLoginClass() + '"></div></a>';
			} else {
				loginButtons += '<button id="BackdoorLogin" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.backdoor") + '"><span class="flex-content"><i class="fa fa-key"></i>&nbsp;' + TAPi18n.__("landingPage.login.backdoor") + '</span></button>';
			}
			loginButtons += '<div class="btn-group backdoorLogin">';
			if (ServerStyle.isLoginEnabled("legacy")) {
				loginButtons += '<label id="backdoor-label">' + title + '</label><br>';
			}
			loginButtons += '<select class="btn btn-secondary btn-raised" id="TestingBackdoorUsername" aria-labelledby="backdoor-label">' +
				'<option id="superAdminLogin" value="admin">' + superAdmin + '</option>' +
				'<option id="adminLogin" value="editor">' + admin + '</option>' +
				'<option id="proLogin" value="pro">' + pro + '</option>' +
				'<option id="lecturerLogin" value="lecturer">' + Meteor.settings.public.university.default + '-' + lecturer + '</option>' +
				'<option id="eduLogin" value="university">' + Meteor.settings.public.university.default + '-' + edu + '</option>' +
				'<option id="standardLogin" value="standard">' + standard + '</option>' +
				'<option id="blockedLogin" value="blocked">' + blocked + '</option>' +
				'<option id="firstLogin" value="firstLogin">' + firstLogin + '</option>' +
				'</select></div>';
		}
		loginButtons += "</div>";
		return loginButtons;
	},
	getServerInventory: function () {
		let cardsetCount, cardCount, userCount, onlineCount;
		if (Meteor.settings.public.welcome.fakeStatistics) {
			let inventory = new ReactiveVar(fakeInventory);
			cardsetCount = inventory.curValue.cardsets;
			cardCount = inventory.curValue.cards;
			userCount = inventory.curValue.users;
			onlineCount = inventory.curValue.online;
		} else {
			cardsetCount = Counts.get('cardsetsCounter') + Counts.get('repetitoriumCounter');
			cardCount = Counts.get('cardsCounter');
			userCount = Counts.get('usersCounter');
			onlineCount = Counts.get('usersOnlineCounter');
		}
		return '</br><span class="serverInventory">' + TAPi18n.__("inventory.cardsets") + "&nbsp;" + splitLargeNumbers(cardsetCount) + "&nbsp;&nbsp;" +
			TAPi18n.__("inventory.cards") + "&nbsp;" + splitLargeNumbers(cardCount) + "&nbsp;&nbsp;" +
			TAPi18n.__("inventory.users") + "&nbsp;" + splitLargeNumbers(userCount) + "&nbsp;&nbsp;" +
			TAPi18n.__("inventory.usersOnline") + "&nbsp;" + splitLargeNumbers(onlineCount) + '</span></br></br>';
	}
});

Template.welcome.onCreated(function () {
	if (Route.isFirstTimeVisit()) {
		Router.go('demo');
	}
	if (NavigatorCheck.gotFeatureSupport(1)) {
		Session.set('isLandingPagePomodoroActive', AdminSettings.findOne({name: "wordcloudPomodoroSettings"}).enabled);
	} else {
		Session.set('isLandingPagePomodoroActive', true);
	}
});

Template.welcome.onRendered(function () {
	$('#clock').removeClass('clock');
	PomodoroTimer.pomoPosition();
	$(window).resize(function () {
		PomodoroTimer.pomoPosition();
	});
	new ResizeSensor($('#welcome'), function () {
		PomodoroTimer.pomoPosition();
	});
	new ResizeSensor($('#welcome-login'), function () {
		PomodoroTimer.pomoPosition();
	});
});

/*
 * ############################################################################
 * welcomeWordcloudButton
 * ############################################################################
 */

Template.welcomeWordcloudButton.events({
	'click .toggle-wordcloud': function () {
		Session.set('isLandingPagePomodoroActive', !Session.get('isLandingPagePomodoroActive'));
		WordcloudCanvas.draw();
		PomodoroTimer.showPomodoroNormal();
	}
});

/*
 * ############################################################################
 * welcomeTitle
 * ############################################################################
 */
Template.welcomeTitle.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});

Template.welcomeTitle.events({
	'click #showDemo': function () {
		CardVisuals.toggleFullscreen();
		Session.set('demoFullscreen', true);
	}
});
