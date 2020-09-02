import {Route} from "../../../util/route";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "../../../util/mainNavigation";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {ServerStyle} from "../../../util/styles";
import {Session} from "meteor/session";
import {isNewCardset} from "../../../ui/forms/cardsetForm";

Template.registerHelper('isPublicRoute', function () {
	return Route.isPublic();
});

Template.registerHelper('isPersonalRoute', function () {
	return Route.isPersonal();
});

Template.registerHelper('isAllRoute', function () {
	return Route.isAll();
});


Template.registerHelper('isFilterIndexRoute', function () {
	return Route.isFilterIndex();
});

Template.registerHelper('isAllRepetitorienRoute', function () {
	return Route.isAllRepetitorien();
});

Template.registerHelper('isMyCardsetsRoute', function () {
	return Route.isMyCardsets();
});

Template.registerHelper('isMyTranscriptsRoute', function () {
	return Route.isMyTranscripts();
});

Template.registerHelper('isMyBonusTranscriptsRoute', function () {
	return Route.isMyBonusTranscripts();
});


Template.registerHelper('isBonusTranscriptsRoute', function () {
	return Route.isMyBonusTranscripts() || Route.isTranscriptBonus() || Route.isPresentationTranscriptBonusCardset() || Route.isPresentationTranscriptBonus() || Route.isPresentationTranscriptReview();
});

Template.registerHelper('isPersonalTranscriptsRoute', function () {
	return Route.isMyTranscripts() || Route.isMyBonusTranscripts();
});

Template.registerHelper('isPersonalRepetitorienRoute', function () {
	return Route.isPersonalRepetitorien();
});

Template.registerHelper('isPoolRoute', function () {
	return Route.isPool();
});

Template.registerHelper('isRepetitoriumRoute', function () {
	return Route.isRepetitorium();
});

Template.registerHelper("isLandingPage", function () {
	return Route.isHome() && (!Meteor.user() && !MainNavigation.isGuestLoginActive());
});

Template.registerHelper("isCardsetTranscriptBonusRoute", function () {
	return Route.isTranscriptBonus();
});

Template.registerHelper("isPresentationTranscriptCardsetRoute", function () {
	return Route.isPresentationTranscriptReview() || Route.isPresentationTranscriptBonusCardset();
});

Template.registerHelper("isPresentationTranscriptReviewRoute", function () {
	return Route.isPresentationTranscriptReview();
});

Template.registerHelper("isShuffleRoute", function () {
	return (FlowRouter.getRouteName() === "shuffle" || FlowRouter.getRouteName() === "editshuffle");
});

Template.registerHelper("isLeitnerRoute", function () {
	return Route.isBox();
});

Template.registerHelper("isLeitnerWozniakRoute", function () {
	return (Route.isBox() || Route.isMemo());
});

Template.registerHelper('isImpressum', function () {
	return Route.isLandingPageRoutes();
});


Template.registerHelper('isTranscriptRoute', function () {
	return Route.isTranscript();
});

Template.registerHelper('isPresentation', function () {
	return Route.isPresentation();
});

Template.registerHelper('isMakingOf', function () {
	return Route.isMakingOf();
});

Template.registerHelper('isCardsetLeitnerStats', function () {
	return Route.isCardsetLeitnerStats();
});

Template.registerHelper('isDemo', function () {
	return Route.isDemo();
});

Template.registerHelper('isEditMode', function () {
	return Route.isEditMode();
});

Template.registerHelper('isBox', function () {
	return Route.isBox();
});

Template.registerHelper('isMemo', function () {
	return Route.isMemo();
});

Template.registerHelper('isCardset', function () {
	return Route.isCardset();
});

Template.registerHelper('isWorkloadRoute', function () {
	return Route.isWorkload();
});

Template.registerHelper("isEditCard", function () {
	return Route.isEditCard();
});

Template.registerHelper("isNewCard", function () {
	return Route.isNewCard();
});

Template.registerHelper('isNotPublicItemView', function () {
	return Route.isAllCardsets() || Route.isAllRepetitorien() || Route.isPersonalRepetitorien() || Route.isMyCardsets();
});

Template.registerHelper('isRepetitorienFilterIndex', function () {
	return Route.isRepetitorienFilterIndex();
});

Template.registerHelper('isFilterIndex', function () {
	return Route.isFilterIndex();
});

Template.registerHelper('isRepetitorienFilterIndexOrShuffle', function () {
	if (ServerStyle.gotSimplifiedNav() && Route.isMyCardsets() && Session.get('useRepForm') && !isNewCardset()) {
		return true;
	}
	if (Route.isCardset()) {
		return this.shuffled;
	}
	return Route.isRepetitorienFilterIndex() || Route.isShuffle() || Route.isEditShuffle();
});
