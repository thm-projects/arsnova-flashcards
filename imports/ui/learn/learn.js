//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Leitner} from "../../api/subscriptions/leitner";
import {Wozniak} from "../../api/subscriptions/wozniak";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {CardNavigation} from "../../api/cardNavigation";
import "../main/overlays/debug/leitnerTimer.js";
import "./learn.html";
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {Bonus} from "../../api/bonus";
import {Route} from "../../api/route";
import {MainNavigation} from "../../api/mainNavigation";
import {CardsetNavigation} from "../../api/cardsetNavigation";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {CardVisuals} from "../../api/cardVisuals";
import {LeitnerTasks} from "../../api/subscriptions/leitnerTasks";

Session.set('animationPlaying', false);

/*
 * ############################################################################
 * learnAlgorithms
 * ############################################################################
 */

Template.learnAlgorithms.onCreated(function () {
	PomodoroTimer.updateServerTimerStart();
	let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {cardType: 1, shuffled: 1, strictWorkloadTimer: 1}});
	Session.set('activeCard', undefined);
	Session.set('isQuestionSide', true);
	Session.set('animationPlaying', false);
	Session.set('cardType', cardset.cardType);
	Session.set('shuffled', cardset.shuffled);
	CardNavigation.toggleVisibility(true);
});

Template.learnAlgorithms.onDestroyed(function () {
	Session.set('activeCard', undefined);
	PomodoroTimer.updateServerTimerIntervalStop();
});

Template.learnAlgorithms.onRendered(function () {
	if (Bonus.isInBonus(Router.current().params._id)) {
		PomodoroTimer.start();
		if (Route.isBox()) {
			let leitnerTask = LeitnerTasks.findOne();
			if (leitnerTask.timer.workload !== undefined) {
				PomodoroTimer.restoreWorkloadTime(leitnerTask.timer.workload);
			}
		}
	}
	if (localStorage.getItem(MainNavigation.getFirstTimeLeitnerString()) !== "true" && Route.isBox() && !NavigatorCheck.isSmartphone()) {
		$('#helpModal').modal('show');
	}
	if (localStorage.getItem(MainNavigation.getFirstTimeWozniakString()) !== "true" && Route.isMemo() && !NavigatorCheck.isSmartphone()) {
		$('#helpModal').modal('show');
	}
	if (Route.isBox()) {
		CardsetNavigation.addToLeitner(Router.current().params._id);
	}
	if (Route.isMemo()) {
		Meteor.call("addWozniakCards", Router.current().params._id);
	}
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
	$('#cardCarousel').on('slide.bs.carousel', function () {
		Session.set('animationPlaying', true);
	});
	CardVisuals.resizeFlashcard();
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
	isPomodoroBreakActive: function () {
		if (Session.get('pomodoroBreakActive') === true) {
			return "disabled";
		}
	}
});

Template.learnAnswerOptions.events({
	"click #learnShowAnswer": function () {
		Session.set('isQuestionSide', false);
		CardNavigation.resetNavigation(false);
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
		Router.go('learn', {
		});
	}
});
