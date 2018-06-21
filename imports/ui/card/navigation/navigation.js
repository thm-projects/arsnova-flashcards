import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import {Route} from "../../../api/route";
import "./navigation.html";
import {CardType} from "../../../api/cardTypes";
import {CardNavigation} from "../../../api/cardNavigation";

/*
 * ############################################################################
 * cardNavigation
 * ############################################################################
 */

Template.cardNavigation.helpers({
	isNavigationVisible: function () {
		return CardNavigation.isVisible();
	}
});

Template.cardNavigation.onCreated(function () {
	if (Session.get('fullscreen') && !Route.isPresentationOrDemo()) {
		CardVisuals.toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
	CardNavigation.toggleVisibility(true);
});

Template.cardNavigation.onRendered(function () {
	$(window).resize(function () {
		if ($(window).width() <= 1200) {
			$("#button-row").insertBefore($("#preview"));
		} else {
			$("#button-row").insertAfter($("#preview"));
		}
	});
});


/*
 * ############################################################################
 * cardNavigationEnabled
 * ############################################################################
 */

Template.cardNavigationEnabled.events({
	'click .switchCardSide': function (event) {
		CardNavigation.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'));
	}
});

Template.cardNavigationEnabled.helpers({
	getCardTypeSides: function () {
		return CardType.getCardTypeCubeSides(Session.get('cardType'));
	},
	getTitle: function () {
		return TAPi18n.__('card.cardType' + Session.get('cardType') + '.content' + this.contentId);
	},
	getTabIndex: function (index) {
		return CardNavigation.getTabIndex(++index);
	},
	isAnswer: function (isAnswer, contentId) {
		return CardNavigation.isAnswer(isAnswer, contentId);
	}
});

Template.cardNavigationEnabled.onRendered(function () {
	CardNavigation.selectButton();
});
