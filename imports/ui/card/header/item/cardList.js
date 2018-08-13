import {Session} from "meteor/session";
import "./cardList.html";
import {Route} from "../../../../api/route";

/*
 * ############################################################################
 * cardHeaderItemCardList
 * ############################################################################
 */

Template.cardHeaderItemCardList.events({
	"click .selectCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
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
