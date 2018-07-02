//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import WordCloud from "wordcloud";
import {Cardsets} from "../../api/cardsets.js";
import {Route} from "../../api/route.js";
import {getUserLanguage} from "../../startup/client/i18n";
import "./welcome.html";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor";


Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
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
	if ($(window).height() <= 450) {
		document.getElementById('tag-cloud-container').height = 0;
		document.getElementById('tag-cloud-canvas').height = 0;
	} else {
		let newWidth = $('#tag-cloud-container').width();
		if (newWidth > 1024) {
			newWidth = 1024;
		}
		document.getElementById('tag-cloud-canvas').width = newWidth;
		document.getElementById('tag-cloud-canvas').height = $(window).height() - ($('#welcome').outerHeight(true) + $('#welcome-login').outerHeight(true));
		if ($(window).width() > 700 && $(window).height() > 700) {
			let cloud = Cardsets.find({wordcloud: true, shuffled: false}, {fields: {name: 1, quantity: 1}}).fetch();
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
				let quantitiy = cloud.quantity / biggestCardsetSize * 10;
				quantitiy = (quantitiy > minimumSize ? quantitiy : minimumSize);
				list.push([name, Number(quantitiy), cloud._id]);
			});
			list.sort(function (a, b) {
				return (b[0].length * b[1]) - (a[0].length * a[1]);
			});
			WordCloud(document.getElementById('tag-cloud-canvas'),
				{
					clearCanvas: true,
					drawOutOfBound: false,
					list: list,
					gridSize: 24,
					weightFactor: 24,
					rotateRatio: 0,
					fontFamily: 'Roboto, Helvetica, Arial,sans-serif',
					color: "random-light",
					hover: wordcloudHover,
					click: wordcloudClick,
					backgroundColor: 'rgba(255,255,255, 0)',
					wait: 500
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
	getFirstTitleWord: function () {
		return Meteor.settings.public.welcome.title.first;
	},
	getLastTitleWord: function () {
		return Meteor.settings.public.welcome.title.last;
	},
	getServerInventory: function () {
		return '</br><span class="serverInventory">' + TAPi18n.__("inventory.cardsets") + "&nbsp;" + splitLargeNumbers(Counts.get('cardsetsCounter')) + "&nbsp;&nbsp;" +
			TAPi18n.__("inventory.cards") + "&nbsp;" + splitLargeNumbers(Counts.get('cardsCounter')) + "&nbsp;&nbsp;" +
			TAPi18n.__("inventory.users") + "&nbsp;" + splitLargeNumbers(Counts.get('usersCounter')) + "&nbsp;&nbsp;" +
			TAPi18n.__("inventory.usersOnline") + "&nbsp;" + splitLargeNumbers(Counts.get('usersOnlineCounter')) + '</span></br></br>';
	}
});

Template.welcome.onCreated(function () {
	if (Route.isFirstTimeVisit()) {
		Router.go('demo');
	}
});

Template.welcome.onRendered(function () {
	createTagCloud();
	$(window).resize(function () {
		createTagCloud();
	});
	new ResizeSensor($('#welcome'), function () {
		createTagCloud();
	});
	new ResizeSensor($('#welcome-login'), function () {
		createTagCloud();
	});
});
