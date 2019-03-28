import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./toggle3D.html";

/*
 * ############################################################################
 * cardSidebarToggle3D
 * ############################################################################
 */

Template.cardSidebarToggle3D.events({
	"click .toggle3D": function () {
		if (Session.get('is3DActive')) {
			Session.set('is3DActive', 0);
		} else {
			Session.set('is3DActive', 1);
		}
		Session.set('activeIndexCards', undefined);
	}
});
