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
	let bottomAdjustment = 385 - dimension.y;
	$('#welcome-tip').html("<p>" + item[3] + "</p>");
	$('#welcome-tip').css({'visibility': 'visible', 'left': dimension.x, 'bottom': bottomAdjustment});
}

/**
 * This method fills the canvas with a wordcloud by using this library: https://github.com/timdream/wordcloud2.js
 */
function createTagCloud() {
	var cloud = Cloud.find({}).fetch();
	var list = [];

	if (cloud.length > 0) {
		list = cloud[0].list;
	} else {
		return;
	}

	document.getElementById('tag-cloud-canvas').width = document.getElementById('tag-cloud-container').offsetWidth;// 750;

	let width = document.getElementById('tag-cloud-canvas').width;
	let gridSize = 20;
	let weightFactor = 1;

	if (width < 300) {
		gridSize = 10;
		weightFactor = 0.6;
	} else if (width < 500) {
		gridSize = 15;
		weightFactor = 0.8;
	}

	document.getElementById('tag-cloud-canvas').height = width / 3.125;

	WordCloud(document.getElementById('tag-cloud-canvas'),
		{
			list: list,
			gridSize: gridSize,
			weightFactor: weightFactor,
			fontFamily: 'Roboto, Helvetica, Arial,sans-serif',
			classes: 'tip-content',
			color: function () {
				return (['#003BD1', '#80BA24', '#FFB300'])[Math.floor(Math.random() * 3)];
			},
			hover: wordcloudHover,
			backgroundColor: '#EEEEEE',
			drawOutOfBound: false,
			rotateRatio: 0.5,
			rotationSteps: 2,
			wait: 100
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

	this.autorun(() => {
		createTagCloud();
	});
});
