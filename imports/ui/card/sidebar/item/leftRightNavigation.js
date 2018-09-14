import "./leftRightNavigation.html";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../../api/cardNavigation";
import {CardIndex} from "../../../../api/cardIndex";

/*
 * ############################################################################
 * cardSidebarLeftRightNavigation
 * ############################################################################
 */

Template.cardSidebarLeftRightNavigation.events({
	"click .scrollLeft": function () {
		CardNavigation.skipAnswer(false);
	},
	"click .scrollRight": function () {
		CardNavigation.skipAnswer();
	}
});

Template.cardSidebarLeftRightNavigation.helpers({
	gotMultipleCards: function () {
		CardIndex.initializeIndex();
		return CardIndex.getCardIndex().length > 1;
	},
	isFirstCardActive: function () {
		if (Session.get('activeCard') !== -1) {
			return CardNavigation.isFirstCard();
		}
	},
	isLastCardActive: function () {
		if (Session.get('activeCard') !== -1) {
			return CardNavigation.isLastCard();
		}
	}
});
