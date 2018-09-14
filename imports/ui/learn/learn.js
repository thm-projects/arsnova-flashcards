//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Leitner, Wozniak} from "../../api/learned.js";
import {Cardsets} from "../../api/cardsets";
import {CardNavigation} from "../../api/cardNavigation";
import "./learn.html";

Meteor.subscribe("cardsets");
Session.set('animationPlaying', false);

/*
 * ############################################################################
 * learnAlgorithms
 * ############################################################################
 */

Template.learnAlgorithms.onCreated(function () {
	Session.set('activeCard', undefined);
	Session.set('isQuestionSide', true);
	Session.set('animationPlaying', false);
	Session.set('cardType', Cardsets.findOne(Router.current().params._id).cardType);
	Session.set('shuffled', Cardsets.findOne(Router.current().params._id).shuffled);
	CardNavigation.toggleVisibility(true);
});

Template.learnAlgorithms.helpers({
	noCards: function () {
		if (ActiveRoute.name('box')) {
			return !Leitner.findOne({
				cardset_id: Router.current().params._id,
				user_id: Meteor.userId(),
				box: {$ne: 6}
			});
		}
		if (ActiveRoute.name('memo')) {
			return !Wozniak.findOne({});
		}
	},
	isFinished: function () {
		if (ActiveRoute.name('box')) {
			return !Leitner.findOne({
				cardset_id: Router.current().params._id,
				user_id: Meteor.userId(),
				active: true
			});
		}
		if (ActiveRoute.name('memo')) {
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
	}
});

Template.learnAlgorithms.events({
	"click .box": function (evt) {
		if (($(evt.target).data('type') !== "cardNavigation")) {
			$('html, body').animate({scrollTop: '0px'}, 300);
		}
	}
});

/*
 * ############################################################################
 * learnAnswerOptions
 * ############################################################################
 */

Template.learnAnswerOptions.onRendered(function () {
	$('#answerOptions').css('width', $('#cardCarousel').width());
	$(window).resize(function () {
		$('#answerOptions').css('width', $('#cardCarousel').width());
	});
	$('#cardCarousel').on('slide.bs.carousel', function () {
		Session.set('animationPlaying', true);
	});
});

Template.learnAnswerOptions.helpers({
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	isNavigationVisible: function () {
		return !CardNavigation.isVisible();
	},
	gotOneCardLeft: function () {
		if (Session.get('isQuestionSide')) {
			return $('.carousel-inner > .item').length === 1;
		}
	},
	checkDisable: function () {
		console.log("Hallo");
		return false;
	}
});

Template.learnAnswerOptions.events({
	"click #learnShowAnswer": function () {
		Session.set('isQuestionSide', false);
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	"click #skipAnswer": function () {
		CardNavigation.skipAnswer();
	},
	"click #known": function () {
		CardNavigation.rateLeitner(false);
	},
	"click #notknown": function () {
		CardNavigation.rateLeitner(true);
	},
	"click .rate-answer": function (event) {
		CardNavigation.rateWozniak(event);
	}
});

/*
 * ############################################################################
 * learnAnswerOptions
 * ############################################################################
 */

Template.learnBackButton.events({
	"click #backButton": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
