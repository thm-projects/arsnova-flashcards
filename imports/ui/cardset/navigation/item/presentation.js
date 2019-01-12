//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./presentation.html";

/*
 * ############################################################################
 * cardsetNavigationPresentation
 * ############################################################################
 */

Template.cardsetNavigationPresentation.events({
	"click #startPresentation": function () {
		Router.go('presentation', {_id: this._id});
	}
});
