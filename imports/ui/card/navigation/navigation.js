import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import {Route} from "../../../api/route";
import {CardEditor} from "../../../api/cardEditor";
import "./navigation.html";
import {CardType} from "../../../api/cardTypes";

/*
 * ############################################################################
 * cardNavigation
 * ############################################################################
 */

Template.cardNavigation.helpers({
	isNavigationDisabled: function () {
		return Session.get('navigationDisabled');
	}
});

Template.cardNavigation.onCreated(function () {
	if (Session.get('fullscreen') && !Route.isPresentationOrDemo()) {
		CardVisuals.toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
	Session.set('navigationDisabled', false);
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
		CardEditor.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'));
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
		return CardEditor.getTabIndex(++index);
	},
	isAnswer: function (isAnswer, contentId) {
		let result = (Route.isBox() || Route.isMemo()) && isAnswer;
		if (result) {
			Session.set('questionSide', contentId);
		}
		return result;
	}
});

Template.cardNavigationEnabled.onRendered(function () {
	$(".cardNavigation > li:nth-child(1) a").click();
});
