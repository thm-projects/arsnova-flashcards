import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import {Route} from "../../../api/route";
import {CardType} from "../../../api/cardTypes";
import {CardNavigation} from "../../../api/cardNavigation";
import "./navigation.html";

/*
 * ############################################################################
 * cardNavigation
 * ############################################################################
 */

Template.cardNavigation.helpers({
	isNavigationVisible: function () {
		return CardNavigation.isVisible();
	},
	isLearningMode: function () {
		return (Route.isMemo() || Route.isBox());
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
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
		return CardNavigation.indexNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')));
	}
});

Template.cardNavigationEnabled.onRendered(function () {
	CardNavigation.selectButton(1);
});

/*
 * ############################################################################
 * cardNavigationEnabledAnswer
 * ############################################################################
 */

Template.cardNavigationEnabledAnswer.events({
	'click .switchCardSide': function (event) {
		CardNavigation.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'));
	}
});

Template.cardNavigationEnabledAnswer.helpers({
	getCardTypeSides: function () {
		return CardNavigation.filterNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')), true);
	}
});

Template.cardNavigationEnabledAnswer.onRendered(function () {
	CardNavigation.selectButton(1);
});

/*
 * ############################################################################
 * cardNavigationEnabledQuestion
 * ############################################################################
 */

Template.cardNavigationEnabledQuestion.events({
	'click .switchCardSide': function (event) {
		CardNavigation.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'));
	}
});

Template.cardNavigationEnabledQuestion.helpers({
	getCardTypeSides: function () {
		return CardNavigation.filterNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')), false);
	}
});

Template.cardNavigationEnabledQuestion.onRendered(function () {
	CardNavigation.selectButton(1);
});

/*
 * ############################################################################
 * cardNavigationItem
 * ############################################################################
 */

Template.cardNavigationItem.helpers({
	getTitle: function () {
		return TAPi18n.__('card.cardType' + Session.get('cardType') + '.content' + this.contentId);
	},
	getTabIndex: function (index) {
		return CardNavigation.getTabIndex(++index);
	}
});
