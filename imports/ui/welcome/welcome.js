//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../api/route.js";
import {getUserLanguage} from "../../startup/client/i18n";
import {ReactiveVar} from 'meteor/reactive-var';
import "./welcome.html";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor";
import * as fakeInventory from '../../../public/fakeStatistics/inventory.json';
import {PomodoroTimer} from "../../api/pomodoroTimer";

Meteor.subscribe("pomodoroLandingPage");
Meteor.subscribe("cardsets");
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
		if (Meteor.settings.public.displayLoginButtons.displayTestingBackdoor) {
			Meteor.insecureUserLogin($("#TestingBackdoorUsername").val(), function (err, result) {
				if (result) {
					setActiveLanguage();
					document.location.reload(true);
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
		let loginButtons = "<label class='loginLabel' for='loginButtonRow'>" + TAPi18n.__('login.label') + "&nbsp;&nbsp;</label><span id='loginButtonRow'>";
		if (Meteor.settings.public.displayLoginButtons.displayCas) {
			loginButtons += '<a id="cas" href=""><img src="img/login/grey/cas.png" alt="use CAS for login"/></a>';
		}
		if (Meteor.settings.public.displayLoginButtons.displayFacebook) {
			loginButtons += '<a id="facebook" href=""><img src="img/login/grey/facebook.png" alt="login using facebook"/></a>';
		}
		if (Meteor.settings.public.displayLoginButtons.displayTwitter) {
			loginButtons += '<a id="twitter" href=""><img src="img/login/grey/twitter.png" alt="use twitter for login"/></a>';
		}
		if (Meteor.settings.public.displayLoginButtons.displayGoogle) {
			loginButtons += '<a id="google" href=""><img src="img/login/grey/google.png" alt="use google for login"/></a>';
		}

		// Backdoor for login in acceptance tests
		if (Meteor.settings.public.displayLoginButtons.displayTestingBackdoor) {
			let title = TAPi18n.__("backdoor.title");
			let superAdmin = TAPi18n.__("backdoor.superAdmin");
			let admin = TAPi18n.__("backdoor.admin");
			let pro = TAPi18n.__("backdoor.pro");
			let lecturer = TAPi18n.__("backdoor.lecturer");
			let edu = TAPi18n.__("backdoor.edu");
			let standard = TAPi18n.__("backdoor.standard");
			let blocked = TAPi18n.__("backdoor.blocked");
			let firstLogin = TAPi18n.__("backdoor.firstLogin");
			loginButtons += '<a id="BackdoorLogin" href=""><img src="img/login/grey/backdoor.png" alt="use backdoor for' +
				' login"/></a>';
			loginButtons += '<span class="btn-group backdoorLogin"><label id="backdoor-label" class="loginLabel">' + title + '</label><br><select class="btn btn-secondary btn-raised" id="TestingBackdoorUsername" aria-labelledby="backdoor-label">' +
				'<option id="superAdminLogin" value="admin">' + superAdmin + '</option>' +
				'<option id="adminLogin" value="editor">' + admin + '</option>' +
				'<option id="proLogin" value="pro">' + pro + '</option>' +
				'<option id="lecturerLogin" value="lecturer">' + Meteor.settings.public.university.default + '-' + lecturer + '</option>' +
				'<option id="eduLogin" value="university">' + Meteor.settings.public.university.default + '-' + edu + '</option>' +
				'<option id="standardLogin" value="standard">' + standard + '</option>' +
				'<option id="blockedLogin" value="blocked">' + blocked + '</option>' +
				'<option id="firstLogin" value="firstLogin">' + firstLogin + '</option>' +
				'</select></span>';
		}
		loginButtons += "</span>";
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
Template.welcomeTitle.helpers({
	getFirstTitleWord: function () {
		return Meteor.settings.public.welcome.title.first;
	},
	getLastTitleWord: function () {
		return Meteor.settings.public.welcome.title.last;
	},
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});
