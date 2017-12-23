//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import WordCloud from "wordcloud";
import {Cloud} from "../../api/cloud.js";
import "./welcome.html";

Meteor.subscribe("wordcloud");

/**
 * This method nserts a hover message for the wordcloud content
 *  @param {Object} item - Array containing data of the wordcloud object (name, description, kind and color)
 *  @param {Object} dimension - X and Y Positions relative to the canvas
 */
function wordcloudHover(item, dimension) {
	if (dimension === undefined) {
		$('#welcome-tip').css({'visibility': 'hidden'});
		return;
	}
	let heightAdjustment = $('#login').height() + $('#tag-cloud-canvas').height() + 30;
	let widthAdjustment;
	if ($('#tag-cloud-canvas').width() < 600) {
		widthAdjustment = 20;
	} else {
		widthAdjustment = dimension.x;
	}
	$('#welcome-tip').html("<p>" + item[3] + "</p>");
	$('#welcome-tip').css({'visibility': 'visible', 'left': widthAdjustment, 'bottom': heightAdjustment});
}

/**
 * This method fills the canvas with a wordcloud by using this library: https://github.com/timdream/wordcloud2.js
 */
function createTagCloud() {
	let cloud = Cloud.find({}).fetch();
	let list = [];

	if (cloud.length > 0) {
		list = cloud[0].list;
	} else {
		return;
	}

	let heightAdjustment = 125;
	document.getElementById('tag-cloud-canvas').height = $(window).height() - ($('.panel-heading').height() + $('#login').height() + $('#footer').height() + heightAdjustment);
	document.getElementById('tag-cloud-canvas').width = document.getElementById('tag-cloud-container').offsetWidth;// 750;

	let textScale = 1.3;
	let wordRotation = 0.7853981634;
	let gridSize = Math.round(16 * $('#tag-cloud-container').width() / 1024);
	let weightFactor = Math.pow(textScale, 2.3) * $('#tag-cloud-container').width() / 1024;
	WordCloud(document.getElementById('tag-cloud-canvas'),
		{
			drawOutOfBound: false,
			list: list,
			gridSize: gridSize,
			weightFactor: weightFactor,
			shape: "diamond",
			rotateRatio: 1.0,
			rotationSteps: 2.0,
			minRotation: wordRotation,
			maxRotation: wordRotation * -3,
			fontFamily: 'Roboto, Helvetica, Arial,sans-serif',
			classes: 'tip-content',
			color: function () {
				return (['#002878', '#78B925', '#F5AA01'])[Math.floor(Math.random() * 3)];
			},
			hover: wordcloudHover,
			backgroundColor: '#EEEEEE',
			wait: 75
		});
}

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
			Meteor.insecureUserLogin($("#TestingBackdoorUsername").val());
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

Template.welcome.onCreated(function () {
	var supportsOrientationChange = "onorientationchange" in window,
		orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

	window.addEventListener(orientationEvent, function () {
		createTagCloud();
	}, false);
	$(window).resize(function () {
		createTagCloud();
	});
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
		$('.panel-footer').append('<select class="btn btn-secondary btn-raised" id="TestingBackdoorUsername">' +
			'<option id="adminLogin" value="admin">admin  (Back end access)</option>' +
			'<option id="editorLogin" value="editor">editor (Back end access)</option>' +
			'<option id="standardLogin" value="standard">standard</option>' +
			'<option id="universityLogin" value="university">university</option>' +
			'<option id="lecturerLogin" value="lecturer">lecturer</option>' +
			'<option id="proLogin" value="pro">pro</option>' +
			'<option id="proLogin" value="blocked">blocked</option>' +
			'<option id="firstLogin" value="firstLogin">firstLogin</option>' +
			'</select>');
	}
	createTagCloud();
});
