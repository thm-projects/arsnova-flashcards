import "./cancel.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptItemCancel
 * ############################################################################
 */

Template.cardsetIndexTranscriptItemCancel.events({
	'click #transcript-bonus-cancel': function () {
		Session.set('transcriptViewingMode', 1);
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
