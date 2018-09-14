import {Session} from "meteor/session";
import "./cardList.html";
import {Route} from "../../../../api/route";
import {CardIndex} from "../../../../api/cardIndex";

/*
 * ############################################################################
 * cardSidebarItemCardList
 * ############################################################################
 */

Template.cardSidebarItemCardList.events({
	"click .selectCard": function () {
		if (Route.isCardset()) {
			Router.go('cardsetlistid', {
				_id: Router.current().params._id
			});
		} else if (Route.isDemo()) {
			Router.go('demolist');
		} else if (Route.isMakingOf()) {
			Router.go('makinglist');
		}  else {
			Router.go('presentationlist', {
				_id: Router.current().params._id
			});
		}
	}
});

Template.cardSidebarItemCardList.helpers({
	gotMultipleCards: function () {
		if (Session.get('activeCard') !== -1) {
			return CardIndex.getCardIndex().length > 1;
		}
	}
});

