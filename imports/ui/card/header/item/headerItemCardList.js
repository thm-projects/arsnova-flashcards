import {Session} from "meteor/session";
import "./headerItemCardList.html";
import {Route} from "../../../../api/route";

/*
 * ############################################################################
 * cardHeaderItemCardList
 * ############################################################################
 */

Template.cardHeaderItemCardList.events({
	"click .selectCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
		if (Route.isDemo()) {
			Router.go('demolist');
		} else {
			Router.go('presentationlist', {
				_id: Router.current().params._id
			});
		}
	}
});
