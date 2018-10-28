//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./editRepetitorium.html";

/*
 * ############################################################################
 * cardsetNavigationEditRepetitorium
 * ############################################################################
 */

Template.cardsetNavigationEditRepetitorium.events({
	'click #editShuffle': function () {
		Router.go('editshuffle', {_id: Router.current().params._id});
	}
});
