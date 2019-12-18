//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../api/route.js";
import {getUserLanguage} from "../../startup/client/i18n";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {AdminSettings} from "../../api/subscriptions/adminSettings";
import {WordcloudCanvas} from "../../api/wordcloudCanvas";
import {ServerStyle} from "../../api/styles.js";
import {FirstTimeVisit} from "../../api/firstTimeVisit";
import {MainNavigation} from "../../api/mainNavigation";
import {ExecuteControllers} from 'wtc-controller-element';
import 'wtc-barfystars';
import "./welcome.html";

Meteor.subscribe("pomodoroLandingPage");
Meteor.subscribe("userData");

function setActiveLanguage() {
	let language = getUserLanguage();
	TAPi18n.setLanguage(language);
	Session.set('activeLanguage', language);
}

//------------------------ LOGIN EVENT

Template.welcome.events({
	'click #facebook': function () {
		if (ServerStyle.isLoginEnabled("facebook")) {
			Meteor.loginWithFacebook({}, function (err) {
				if (err) {
					throw new Meteor.Error("Facebook login failed");
				} else {
					setActiveLanguage();
				}
			});
		}
	},

	'click #twitter': function () {
		if (ServerStyle.isLoginEnabled("twitter")) {
			Meteor.loginWithTwitter({}, function (err) {
				if (err) {
					throw new Meteor.Error("Twitter login failed");
				} else {
					setActiveLanguage();
				}
			});
		}
	},

	'click #google': function () {
		if (ServerStyle.isLoginEnabled("google")) {
			Meteor.loginWithGoogle({}, function (err) {
				if (err) {
					throw new Meteor.Error("Google login failed");
				} else {
					setActiveLanguage();
				}
			});
		}
	},

	'click #cas': function () {
		if (ServerStyle.isLoginEnabled("cas")) {
			Meteor.loginWithCas(function (err) {
				if (err) {
					throw new Meteor.Error("CAS login failed");
				} else {
					setActiveLanguage();
				}
			});
		}
	},

	// Backdoor for login in acceptance tests
	'click #BackdoorLogin': function () {
		if (ServerStyle.isLoginEnabled("backdoor")) {
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
	},

	'click #guest': function () {
		MainNavigation.setGuestLogin("true");
		Session.set('firedUseCaseModal', 1);
		Router.go('pool');
	}
});

Template.welcome.helpers({
	getLoginButtons: function () {
		let loginButtons = "<div id='loginButtonRow'>";
		if (ServerStyle.isLoginEnabled("guest")) {
			loginButtons += '<button id="guest" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.guest") + '"><span class="flex-content"><i class="far fa-smile" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.guest") + '</span></button>';
		}
		if (ServerStyle.isLoginEnabled("cas")) {
			loginButtons += '<button id="cas" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.cas") + '"><span class="flex-content"><i class="fas fa-university" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.cas") + '</span></button>';
		}
		if (ServerStyle.isLoginEnabled("pro")) {
			loginButtons += '<button id="pro" class="btn btn-large btn-raised btn-block" data-toggle="modal" data-target="#underDevelopmentModal" title="' + TAPi18n.__("landingPage.login.tooltip.pro") + '"><span class="flex-content"><i class="fab fa-paypal" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.pro") + '</span></button>';
		}
		if (ServerStyle.isLoginEnabled("facebook")) {
			loginButtons += '<button id="facebook" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.facebook") + '"><span class="flex-content"><i class="fab fa-facebook" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.facebook") + '</span></button>';
		}
		if (ServerStyle.isLoginEnabled("twitter")) {
			loginButtons += '<button id="twitter" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.twitter") + '"><span class="flex-content"><i class="fab fa-twitter" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.twitter") + '</span></button>';
		}
		if (ServerStyle.isLoginEnabled("google")) {
			loginButtons += '<button id="google" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.google") + '"><span class="flex-content"><i class="fab fa-google" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.google") + '</span></button>';
		}
		// Backdoor for login in acceptance tests
		if (ServerStyle.isLoginEnabled("backdoor")) {
			let superAdmin = TAPi18n.__("backdoor.superAdmin");
			let admin = TAPi18n.__("backdoor.admin");
			let pro = TAPi18n.__("backdoor.pro");
			let lecturer = TAPi18n.__("backdoor.lecturer");
			let edu = TAPi18n.__("backdoor.edu");
			let standard = TAPi18n.__("backdoor.standard");
			let blocked = TAPi18n.__("backdoor.blocked");
			let firstLogin = TAPi18n.__("backdoor.firstLogin");
			loginButtons += '<button id="BackdoorLogin" class="btn btn-large btn-raised btn-block" title="' + TAPi18n.__("landingPage.login.tooltip.backdoor") + '"><span class="flex-content"><i class="fas fa-key" style="font-size:150%"></i>&nbsp;' + TAPi18n.__("landingPage.login.backdoor") + '</span></button>';
			loginButtons += '<div class="btn-group backdoorLogin">';
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
	}
});

Template.welcome.onCreated(function () {
	if (Route.isFirstTimeVisit()) {
		if (FirstTimeVisit.isFirstTimeVisitDemoEnabled()) {
			Router.go('demo');
		} else {
			Route.setFirstTimeVisit();
		}
	}
	if (NavigatorCheck.gotFeatureSupport(1) && ServerStyle.gotLandingPageWordcloud()) {
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
 * welcomeTitle
 * ############################################################################
 */

Template.welcomeTitle.onRendered(function () {
	ExecuteControllers.instanciateAll();
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
