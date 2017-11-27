//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Learned} from "../../api/learned.js";
import {turnCard, resizeAnswers} from "../card/card.js";
import "./memo.html";


Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

/*
 * ############################################################################
 * memo
 * ############################################################################
 */

Template.memo.onCreated(function () {
	Session.set('modifiedCard', undefined);
});

Template.memo.onRendered(function () {
	resizeAnswers();
	$(window).resize(function () {
		resizeAnswers();
	});
});

Template.memo.onDestroyed(function () {
	Session.set("showAnswer", false);
});

Template.memo.helpers({
	showAnswer: function () {
		turnCard();
		$('html, body').animate({scrollTop: '0px'}, 300);
		return Session.get('showAnswer');
	},
	isFinish: function () {
		var actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);

		var learned = Learned.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			nextDate: {
				$lte: actualDate
			}
		});

		return (learned === undefined);
	}
});

/**
 * Declare event handlers for instances of the memo template.
 */
Template.memo.events({
	/**
	 * Show Answer in SuperMemo mode
	 * Sets the showAnswer variable of the Session = true
	 */
	"click #memoShowAnswer": function () {
		Session.set('showAnswer', true);
	},
	"click .rate-answer": function (event) {
		Meteor.call("updateLearnedMemo", Router.current().params._id, $('.carousel-inner > .active').attr('data-id'), $(event.currentTarget).data("id"));
		Session.set("showAnswer", false);
		turnCard();
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	/**
	 * Go back to cardset from SuperMemo mode
	 * Go back one page in the history, on click of the "Return to cardset" button
	 */
	"click #backButton": function () {
		window.history.go(-1);
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
