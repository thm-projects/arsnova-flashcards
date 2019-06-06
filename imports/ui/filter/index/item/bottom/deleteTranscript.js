import "./deleteTranscript.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * filterIndexItemBottomDeleteTranscript
 * ############################################################################
 */

Template.filterIndexItemBottomDeleteTranscript.events({
	'click .deleteCard': function (event) {
		Session.set('activeCard', $(event.target).data('id'));
	}
});
