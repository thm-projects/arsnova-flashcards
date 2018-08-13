import "./endPresentation.html";
import {Route} from "../../../../api/route";

/*
 * ############################################################################
 * cardHeaderItemEndPresentation
 * ############################################################################
 */

Template.cardHeaderItemEndPresentation.events({
	"click .endPresentation": function () {
		if (Route.isMakingOf()) {
			Router.go('home');
		} else {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}
	}
});
