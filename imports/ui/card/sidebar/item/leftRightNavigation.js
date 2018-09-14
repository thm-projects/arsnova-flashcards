import "./leftRightNavigation.html";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../../api/cardNavigation";
import {CardIndex} from "../../../../api/cardIndex";

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
	}
});
