//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import WordCloud from "wordcloud";
import {Cardsets} from "../../api/cardsets.js";
import {getUserLanguage} from "../../startup/client/i18n";
import "./welcome.html";
import {Session} from "meteor/session";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");

function setActiveLanguage() {
	let language = getUserLanguage();
	TAPi18n.setLanguage(language);
	Session.set('activeLanguage', language);
}

/**
 * This method nserts a hover message for the wordcloud content
 *  @param {Object} item - Array containing data of the wordcloud object (name, description, kind and color)
 */
function wordcloudClick(item) {
	Session.set('wordcloudItem', item[2]);
	$('#wordcloudModal').modal('show');
}

function wordcloudHover(item, dimension) {
	if (dimension !== undefined) {
		$('#tag-cloud-canvas').css('cursor', 'pointer');
	} else {
		$('#tag-cloud-canvas').css('cursor', 'unset');
	}
}

/**
 * This method fills the canvas with a wordcloud by using this library: https://github.com/timdream/wordcloud2.js
 */
function createTagCloud() {
	$('#cards-welcome-image').css('height', $('.color-cards').height());
	if ($(window).height() <= 450) {
		document.getElementById('tag-cloud-container').height = 0;
		document.getElementById('tag-cloud-canvas').height = 0;
	} else {
		document.getElementById('tag-cloud-container').height = 'unset';
		document.getElementById('tag-cloud-canvas').width = document.getElementById('tag-cloud-container').offsetWidth;
		document.getElementById('tag-cloud-canvas').height = $(window).height() - ($('.panel-heading').outerHeight(true) + $('#login').outerHeight(true));
		if ($(window).width() > 700 && $(window).height() > 700) {
			let textScale = 1.2;
			let gridSize = Math.round(16 * $('#tag-cloud-canvas').width() / 1440);
			let weightFactor = Math.pow(textScale, 2.3) * $('#tag-cloud-canvas').width() / 450;
			let cloud = Cardsets.find({wordcloud: true}, {fields: {name: 1, quantity: 1}}).fetch();
			let minimumSize = 0;
			let biggestCardsetSize = 0;
			let list = [];

			cloud.forEach(function (cloud) {
				if (cloud.quantity > biggestCardsetSize) {
					biggestCardsetSize = cloud.quantity;
				}
			});

			cloud.forEach(function (cloud) {
				let name = cloud.name;

				if (name.length > 25) {
					name = name.substring(0, 25) + "…";
				}
				let quantitiy = cloud.quantity / biggestCardsetSize * 40;
				quantitiy = (quantitiy > minimumSize ? quantitiy : minimumSize);
				list.push([name, Number(quantitiy), cloud._id]);
			});
			list.sort(function (a, b) {
				return (b[0].length * b[1]) - (a[0].length * a[1]);
			});
			WordCloud(document.getElementById('tag-cloud-canvas'),
				{
					list: list,
					gridSize: gridSize,
					weightFactor: weightFactor,
					minSize: 8,
					drawOutOfBound: false,
					rotateRatio: 0,
					fontFamily: 'Roboto, Helvetica, Arial,sans-serif',
					color: "random-light",
					hover: wordcloudHover,
					click: wordcloudClick,
					backgroundColor: 'rgba(255,255,255, 0)',
					wait: 800
				});
		}
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
		if (Meteor.settings.public.displayLoginButtons.displayTestingBackdoor) {
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
		let loginButtons = "<label class='loginLabel' for='loginButtonRow'>" + TAPi18n.__('login.label') + ":&nbsp;</label><span id='loginButtonRow'>";
		if (Meteor.settings.public.displayLoginButtons.displayCas) {
			loginButtons += '<a id="cas" href=""><img src="img/THM_login.png" alt="use CAS for login"/></a>';
		}
		if (Meteor.settings.public.displayLoginButtons.displayFacebook) {
			loginButtons += '<a id="facebook" href=""><img src="img/social_facebook_box_white.png" alt="login using facebook"/></a>';
		}
		if (Meteor.settings.public.displayLoginButtons.displayTwitter) {
			loginButtons += '<a id="twitter" href=""><img src="img/social_twitter_box_white.png" alt="use twitter for login"/></a>';
		}
		if (Meteor.settings.public.displayLoginButtons.displayGoogle) {
			loginButtons += '<a id="google" href=""><img src="img/social_google_box_white.png" alt="use google for login"/></a>';
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
			loginButtons += '<a id="BackdoorLogin" href=""><img src="img/backdoor-login.png" alt="use backdoor for' +
				' login"/></a>';
			loginButtons += '<span class="btn-group backdoorLogin"><label id="backdoor-label" class="loginLabel">' + title + ':</label><br><select class="btn btn-secondary btn-raised" id="TestingBackdoorUsername" aria-labelledby="backdoor-label">' +
				'<option id="superAdminLogin" value="admin">' + superAdmin + '</option>' +
				'<option id="adminLogin" value="editor">' + admin + '</option>' +
				'<option id="proLogin" value="pro">' + pro + '</option>' +
				'<option id="lecturerLogin" value="lecturer">' + Meteor.settings.public.university.default + '-' + lecturer + '</option>' +
				'<option id="eduLogin" value="university">' + Meteor.settings.public.university.default +  '-' + edu + '</option>' +
				'<option id="standardLogin" value="standard">' + standard + '</option>' +
				'<option id="blockedLogin" value="blocked">' + blocked + '</option>' +
				'<option id="firstLogin" value="firstLogin">' + firstLogin + '</option>' +
				'</select></span>';
		}
		loginButtons += "</span>";
		return loginButtons;
	}
});

Template.welcome.onRendered(function () {
	this.autorun(() => {
		createTagCloud();
	});
	$("#cards-welcome-image").load(function () {
		createTagCloud();
	});
	$(window).resize(function () {
		createTagCloud();
	});
});
