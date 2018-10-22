import "./help.html";
import {Route} from "../../../../api/route";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardSidebarItemHelp
 * ############################################################################
 */

Template.cardSidebarItemHelp.events({
	"click .showModalHelp": function () {
		if (Route.isPresentation() || Route.isDemo()) {
			$('#presentationHelpModal').modal('show');
		} else if (Route.isBox()) {
			$('#leitnerHelpModal').modal('show');
		} else if (Route.isMemo()) {
			$('#wozniakHelpModal').modal('show');
		}
	}
});

Template.cardSidebarItemHelp.helpers({
	modalActive: function () {
		return Session.get('helpModalActive');
	}
});

