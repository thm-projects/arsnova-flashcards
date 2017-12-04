//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Leitner} from "../../api/learned.js";
import {turnCard, resizeAnswers, toggleFullscreen} from "../card/card.js";
import "./box.html";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe('leitner');

Session.set('isFront', true);

/*
 * ############################################################################
 * box
 * ############################################################################
 */

Template.box.onCreated(function () {
	Session.set('modifiedCard', undefined);
});

Template.box.helpers({
	noCards: function () {
		return !Leitner.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			box: {$ne: 6}
		});
	},
	isFinished: function () {
		return !Leitner.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			active: true
		});
	}
});


Template.box.events({
	/**
	 * Go back to cardset from leitner box mode
	 * Go back one page in the history, on click of the "Return to cardset" button
	 */
	"click #backButton": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});


/*
 * ############################################################################
 * boxEnd
 * ############################################################################
 */

Template.boxEnd.onCreated(function () {
	if (Session.get('fullscreen')) {
		toggleFullscreen();
	}
});

/*
 * ############################################################################
 * boxEmpty
 * ############################################################################
 */

Template.boxEmpty.onCreated(function () {
	if (Session.get('fullscreen')) {
		toggleFullscreen();
	}
});

/*
 * ############################################################################
 * boxMain
 * ############################################################################
 */

Template.boxMain.onCreated(function () {
	Session.set('isFront', true);
});

Template.boxMain.onRendered(function () {
	resizeAnswers();
	$(window).resize(function () {
		resizeAnswers();
	});
});

Template.boxMain.helpers({
	isFront: function () {
		return Session.get('isFront');
	}
});

Template.boxMain.events({
	"click .box": function (evt) {
		if (($(evt.target).data('type') !== "cardNavigation")) {
			if (Session.get('isFront')) {
				Session.set('isFront', false);
			} else {
				Session.set('isFront', true);
			}
			$('html, body').animate({scrollTop: '0px'}, 300);
		}
	},
	"click #boxShowAnswer": function () {
		if (Session.get('isFront')) {
			Session.set('isFront', false);
		} else {
			Session.set('isFront', true);
		}
		turnCard();
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	"click #known": function () {
		Meteor.call('updateLeitner', Router.current().params._id, $('.carousel-inner > .active').attr('data-id'), false);
		Session.set('isFront', true);
		turnCard();
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	"click #notknown": function () {
		Meteor.call('updateLeitner', Router.current().params._id, $('.carousel-inner > .active').attr('data-id'), true);
		Session.set('isFront', true);
		turnCard();
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
	}
});
