//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "../main/modal/arsnovaClick.js";
import "../main/modal/arsnovaLite.js";
import "../help/help.js";
import "../card/card.js";
import "../cardset/index/cards/cards.js";
import "./presentation.html";
import {CardNavigation} from "../../util/cardNavigation";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {Cards} from "../../api/subscriptions/cards";
import {PomodoroTimer} from "../../util/pomodoroTimer";
import {Route} from "../../util/route";
import {AspectRatio} from "../../util/aspectRatio";
import {TranscriptBonus} from "../../api/subscriptions/transcriptBonus";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Session.set('animationPlaying', false);
Session.setDefault('isDirectCardsetIndexView', false);
/*
 * ############################################################################
 * presentation
 * ############################################################################
 */

Template.presentation.onCreated(function () {
	Session.set('firedUseCaseModal', true);
	if (Session.get('aspectRatioMode') === 0) {
		Session.set('aspectRatioMode', AspectRatio.getDefault());
	}
	if (Route.isPresentationTranscriptBonus() || Route.isPresentationTranscriptBonusCardset()) {
		Session.set('transcriptBonus', TranscriptBonus.findOne({card_id: FlowRouter.getParam('card_id')}));
	}
	if (Route.isPresentationTranscriptReview()) {
		Session.set('transcriptBonus', TranscriptBonus.findOne({cardset_id: FlowRouter.getParam('_id')}));
	}
});

Template.presentation.helpers({
	gotTranscriptsLeftToReview: function () {
		return TranscriptBonus.find({cardset_id: FlowRouter.getParam('_id')}).count();
	}
});

Template.presentation.onDestroyed(function () {
	Session.set('transcriptBonus', undefined);
});

/*
 * ############################################################################
 * presentationView
 * ############################################################################
 */

Template.presentationView.onCreated(function () {
	if (!Route.isDefaultPresentation() && !Route.isDemo()) {
		Session.set('activeCard', undefined);
	} else if (Route.isDemo() && Session.get('previousRouteName') !== "demo" && Session.get('previousRouteName') !== "demolist") {
		Session.set('activeCard', undefined);
	}
	CardNavigation.toggleVisibility(true);
	PomodoroTimer.setPresentationPomodoro(true);
});

Template.presentationView.onRendered(function () {
	CardNavigation.toggleVisibility(true);
});

Template.presentationView.onDestroyed(function () {
	Session.set('contrastMode', false);
	Session.set('hideSidebar', false);
});

/*
 * ############################################################################
 * makingOfCards
 * ############################################################################
 */

Template.makingOfCards.helpers({
	gotMakingOfCardsetData: function () {
		let cardset = Cardsets.findOne({shuffled: true, kind:  "demo", name: "MakingOfCardset"});
		if (cardset !== undefined) {
			let cardCount = Cards.find({cardset_id: {$in: cardset.cardGroups}}).count();
			return cardCount === cardset.quantity;
		}
	}
});
