import "./endPresentation.html";
import {Route} from "../../../../api/route";
import {SweetAlertMessages} from "../../../../api/sweetAlert";

/*
 * ############################################################################
 * cardSidebarItemEndPresentation
 * ############################################################################
 */

Template.cardSidebarItemEndPresentation.events({
	"click .endPresentation": function () {
		if (Route.isMakingOf()) {
			Router.go('home');
		} else {
			SweetAlertMessages.exitPresentation();
		}
	}
});
