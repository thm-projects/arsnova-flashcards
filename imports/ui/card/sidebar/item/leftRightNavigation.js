import "./leftRightNavigation.html";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../../util/cardNavigation";
import {CardIndex} from "../../../../util/cardIndex";
import {Route} from "../../../../util/route";

/*
 * ############################################################################
 * cardSidebarLeftNavigation
 * ############################################################################
 */

Template.cardSidebarLeftNavigation.events({
	"click .scrollLeft": function () {
		CardNavigation.skipAnswer(false);
	}
});

Template.cardSidebarLeftNavigation.helpers({
	gotMultipleCards: function () {
		CardIndex.initializeIndex();
		return CardIndex.getCardIndex().length > 1;
	},
	isFirstCardActive: function () {
		if (Session.get('activeCard') !== -1) {
			return CardNavigation.isFirstCard();
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	getPreviousCardHotkey: function () {
		return TAPi18n.__('card.tooltip.previousCardHotkey');
	},
	isCardNavigationVisible: function () {
		return CardNavigation.isVisible();
	}
});

/*
 * ############################################################################
 * cardSidebarRightNavigation
 * ############################################################################
 */

Template.cardSidebarRightNavigation.events({
	"click .scrollRight": function () {
		CardNavigation.skipAnswer();
	}
});

Template.cardSidebarRightNavigation.helpers({
	gotMultipleCards: function () {
		CardIndex.initializeIndex();
		return CardIndex.getCardIndex().length > 1;
	},
	isLastCardActive: function () {
		if (Session.get('activeCard') !== -1) {
			return CardNavigation.isLastCard();
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	getNextCardHotkey: function () {
		return TAPi18n.__('card.tooltip.nextCardHotkey');
	},
	isCardNavigationVisible: function () {
		return CardNavigation.isVisible();
	}
});
