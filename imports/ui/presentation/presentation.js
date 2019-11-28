//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import {CardNavigation} from "../../api/cardNavigation";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {Cards} from "../../api/subscriptions/cards";
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {Route} from "../../api/route";
import {MainNavigation} from "../../api/mainNavigation";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {FirstTimeVisit} from "../../api/firstTimeVisit";
import {AspectRatio} from "../../api/aspectRatio";
import {TranscriptBonus} from "../../api/subscriptions/transcriptBonus";
import {CardVisuals} from "../../api/cardVisuals";

Session.set('animationPlaying', false);

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
	if (localStorage.getItem(MainNavigation.getFirstTimePresentationString()) !== "true" && Route.isPresentation() && !NavigatorCheck.isSmartphone() && FirstTimeVisit.isFirstTimePresentationModalEnabled()) {
		$('#helpModal').modal('show');
	}
});

Template.presentationView.onDestroyed(function () {
	Session.set('contrastMode', false);
	Session.set('hideSidebar', false);
});

Template.presentationView.events({
	"click #backToPresentation, click #backToPresentationFullscreen": function () {
		if (Router.current().route.getName() === "demolist") {
			Router.go('demo');
		} else if (Router.current().route.getName() === "makinglist") {
			Router.go('making');
		} else {
			Router.go('presentation', {
				_id: Router.current().params._id
			});
		}
	}
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
