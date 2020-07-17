import {Session} from "meteor/session";
import {MainNavigation} from "../../../../util/mainNavigation";
import "./help.html";

/*
 * ############################################################################
 * cardSidebarItemHelp
 * ############################################################################
 */

Template.cardSidebarItemHelp.events({
	"click .showModalHelp": function () {
		MainNavigation.showHelp();
	}
});

Template.cardSidebarItemHelp.helpers({
	modalActive: function () {
		return Session.get('helpModalActive');
	}
});

