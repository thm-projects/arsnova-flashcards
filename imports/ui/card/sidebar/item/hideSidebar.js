import {Session} from "meteor/session";
import "./hideSidebar.html";

/*
 * ############################################################################
 * cardSidebarItemHideSidebar
 * ############################################################################
 */

Template.cardSidebarItemHideSidebar.events({
	'click .toggleSidebar': function () {
		Session.set('hideSidebar', !Session.get('hideSidebar'));
	}
});
