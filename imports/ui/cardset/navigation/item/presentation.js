//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./presentation.html";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetNavigationPresentation
 * ############################################################################
 */

Template.cardsetNavigationPresentation.events({
	"click .startPresentation": function () {
		Session.set('aspectRatioMode', 0);
		Router.go('presentation', {_id: this._id});
	}
});
