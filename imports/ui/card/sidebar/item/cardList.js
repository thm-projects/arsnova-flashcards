import {Session} from "meteor/session";
import "./cardList.html";
import {CardIndex} from "../../../../api/cardIndex";
import {CardsetNavigation} from "../../../../api/cardsetNavigation";

/*
 * ############################################################################
 * cardSidebarItemCardList
 * ############################################################################
 */

Template.cardSidebarItemCardList.events({
	"click .selectCard": function () {
		CardsetNavigation.goToIndex();
	}
});

Template.cardSidebarItemCardList.helpers({
	gotMultipleCards: function () {
		if (Session.get('activeCard') !== -1) {
			return CardIndex.getCardIndex().length > 1;
		}
	}
});

