//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Wozniak} from "../../api/learned.js";
import {turnCard, resizeAnswers} from "../card/card.js";
import "./memo.html";


Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("wozniak");

Session.set('isFront', true);

/*
 * ############################################################################
 * memo
 * ############################################################################
 */

Template.memo.onCreated(function () {
	Session.set('modifiedCard', undefined);
	Session.set('isFront', true);
});

Template.memo.onRendered(function () {
	resizeAnswers();
	$(window).resize(function () {
		resizeAnswers();
	});
});

Template.memo.helpers({
	isFront: function () {
		return Session.get('isFront');
	},
	isFinish: function () {
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);

		return !Wozniak.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			nextDate: {
				$lte: actualDate
			}
		});
	}
});

/**
 * Declare event handlers for instances of the memo template.
 */
Template.memo.events({
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
	"click #memoShowAnswer": function () {
		if (Session.get('isFront')) {
			Session.set('isFront', false);
		} else {
			Session.set('isFront', true);
		}
		turnCard();
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	"click .rate-answer": function (event) {
		Meteor.call("updateWozniak", Router.current().params._id, $('.carousel-inner > .active').attr('data-id'), $(event.currentTarget).data("id"));
		Session.set('isFront', true);
		turnCard();
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	/**
	 * Go back to cardset from SuperMemo mode
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
 * memoRate
 * ############################################################################
 */

Template.memoRate.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		placement: 'bottom'
	});
	$('[data-toggle="popover"]').popover({
		placement: 'left'
	});
});
