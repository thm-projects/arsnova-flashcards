//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Leitner} from "../../api/subscriptions/leitner";
import {Wozniak} from "../../api/subscriptions/wozniak";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {CardNavigation} from "../../util/cardNavigation";
import "../main/overlays/debug/leitnerTimer.js";
import "../main/modal/arsnovaClick.js";
import "../main/modal/arsnovaLite.js";
import "../help/help.js";
import "../card/card.js";
import "../cardset/index/bonus/modal/userHistory.js";
import "./learn.html";
import {PomodoroTimer} from "../../util/pomodoroTimer";
import {Route} from "../../util/route";
import {MainNavigation} from "../../util/mainNavigation";
import {NavigatorCheck} from "../../util/navigatorCheck";
import {CardVisuals} from "../../util/cardVisuals";
import {Bonus} from "../../util/bonus";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {CardIndex} from "../../util/cardIndex";
import {AnswerUtilities} from "../../util/answers";

Session.set('animationPlaying', false);

/*
 * ############################################################################
 * learnAlgorithms
 * ############################################################################
 */

Template.learnAlgorithms.onCreated(function () {
	if (Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id'))) {
		PomodoroTimer.updateServerTimerStart();
		PomodoroTimer.start();
	}
	let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {cardType: 1, shuffled: 1, strictWorkloadTimer: 1}});
	Session.set('activeCard', undefined);
	Session.set('isQuestionSide', true);
	Session.set('animationPlaying', false);
	Session.set('cardType', cardset.cardType);
	Session.set('shuffled', cardset.shuffled);
	CardNavigation.toggleVisibility(true);
});

Template.learnAlgorithms.onDestroyed(function () {
	Session.set('activeCard', undefined);
	if (Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id'))) {
		PomodoroTimer.updateServerTimerIntervalStop();
	}
	PomodoroTimer.showPomodoroFullsize();
});

Template.learnAlgorithms.onRendered(function () {
	if (localStorage.getItem(MainNavigation.getFirstTimeLeitnerString()) !== "true" && Route.isBox() && !NavigatorCheck.isSmartphone()) {
		$('#helpModal').modal('show');
	}
	if (localStorage.getItem(MainNavigation.getFirstTimeWozniakString()) !== "true" && Route.isMemo() && !NavigatorCheck.isSmartphone()) {
		$('#helpModal').modal('show');
	}
});

Template.learnAlgorithms.helpers({
	noCards: function () {
		if (FlowRouter.getRouteName() === 'box') {
			return !Leitner.findOne({
				cardset_id: FlowRouter.getParam('_id'),
				user_id: Meteor.userId(),
				box: {$ne: 6}
			});
		}
		if (FlowRouter.getRouteName() === 'memo') {
			return !Wozniak.findOne({});
		}
	},
	isFinished: function () {
		if (FlowRouter.getRouteName() === 'box') {
			return !Leitner.findOne({
				cardset_id: FlowRouter.getParam('_id'),
				user_id: Meteor.userId(),
				active: true
			});
		}
		if (FlowRouter.getRouteName() === 'memo') {
			let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			actualDate.setHours(0, 0, 0, 0);

			return !Wozniak.findOne({
				cardset_id: FlowRouter.getParam('_id'),
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

Template.learnAnswerOptions.onCreated(function () {
	AnswerUtilities.resetSelectedAnswers();
});

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
	},
	gotMCQuestion: function () {
		return AnswerUtilities.gotLeitnerMcEnabled();
	},
	canSubmitMC: function () {
		return Session.get('selectedAnswers').length > 0;
	}
});

Template.learnAnswerOptions.events({
	"click #learnSendAnswer": function () {
		Session.set('isQuestionSide', false);
		let timestamps = Session.get('leitnerHistoryTimestamps');
		timestamps.answer = new Date();
		Session.set('leitnerHistoryTimestamps', timestamps);
		Meteor.call('setMCAnswers', CardIndex.getCardIndexFilter(), Session.get('activeCard'), FlowRouter.getParam('_id'), Session.get('selectedAnswers'), Session.get('leitnerHistoryTimestamps'), function (error, result) {
			if (!error) {
				Session.set('activeCardAnswers', result);
				CardNavigation.resetNavigation(false);
				$('html, body').animate({scrollTop: '0px'}, 300);
			}
		});
	},
	"click #nextMCCard": function () {
		CardNavigation.switchCardMc(Session.get('activeCard'));
	},
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
		FlowRouter.go('learn', {
		});
	}
});
