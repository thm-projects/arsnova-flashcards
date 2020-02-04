//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import {CardNavigation} from "../../api/cardNavigation";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {Cards} from "../../api/subscriptions/cards";
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {Route} from "../../api/route";
import {AspectRatio} from "../../api/aspectRatio";
import {TranscriptBonus} from "../../api/subscriptions/transcriptBonus";
import {CardVisuals} from "../../api/cardVisuals";

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
		Session.set('transcriptBonus', TranscriptBonus.findOne({card_id: Router.current().params.card_id}));
	}
	if (Route.isPresentationTranscriptReview()) {
		Session.set('transcriptBonus', TranscriptBonus.findOne({cardset_id: Router.current().params._id}));
	}
});

Template.presentation.onRendered(function () {
	if (!CardVisuals.isFullscreen() && !Route.isDemo() && !Route.isMakingOf()) {
		CardVisuals.toggleFullscreen();
	}
});

Template.presentation.helpers({
	gotTranscriptsLeftToReview: function () {
		return TranscriptBonus.find({cardset_id: Router.current().params._id}).count();
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
	if (!Route.isDefaultPresentation()) {
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
