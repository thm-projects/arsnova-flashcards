//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./welcome.html";

//------------------------ LOGIN EVENT

Template.welcome.events({
	'click #facebook': function () {
		Meteor.loginWithFacebook({}, function (err) {
			if (err) {
				throw new Meteor.Error("Facebook login failed");
			}
		});
	},

	'click #twitter': function () {
		Meteor.loginWithTwitter({}, function (err) {
			if (err) {
				throw new Meteor.Error("Twitter login failed");
			}
		});
	},

	'click #google': function () {
		Meteor.loginWithGoogle({}, function (err) {
			if (err) {
				throw new Meteor.Error("Google login failed");
			}
		});
	},

	'click #cas': function () {
		Meteor.loginWithCas({}, function (err) {
			if (err) {
				throw new Meteor.Error("CAS login failed");
			}
		});
	},

	// Backdoor for login in acceptance tests
	'click #BackdoorLogin': function () {
		if (Meteor.settings.public.displayLoginButtons.displayTestingBackdoor) {
			Meteor.insecureUserLogin(document.getElementById("TestingBackdorUsername").value);
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

Template.welcome.onRendered(function () {
	if (Meteor.settings.public.displayLoginButtons.displayFacebook) {
		$('.panel-footer').append('<a id="facebook" href=""><img src="img/social_facebook_box_white.png" alt="login using facebook"/></a>');
	}
	if (Meteor.settings.public.displayLoginButtons.displayTwitter) {
		$('.panel-footer').append('<a id="twitter" href=""><img src="img/social_twitter_box_white.png" alt="use twitter for login"/></a>');
	}
	if (Meteor.settings.public.displayLoginButtons.displayGoogle) {
		$('.panel-footer').append('<a id="google" href=""><img src="img/social_google_box_white.png" alt="use google for login"/></a>');
	}
	if (Meteor.settings.public.displayLoginButtons.displayCas) {
		$('.panel-footer').append('<a id="cas" href=""><img src="img/social_cas_box_white.png" alt="use CAS for login"/></a>');
	}

	// Backdoor for login in acceptance tests
	if (Meteor.settings.public.displayLoginButtons.displayTestingBackdoor) {
		$('.panel-footer').append('<a id="BackdoorLogin" href=""><img src="img/social_backdoor_box_white.png" /></a>');
		$('.panel-footer').append('<input id="TestingBackdorUsername" type="text" name="username" placeholder="username"></input>');
	}
});
