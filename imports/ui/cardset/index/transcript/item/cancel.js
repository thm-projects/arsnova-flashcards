import "./cancel.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardsetIndexTranscriptItemCancel
 * ############################################################################
 */

Template.cardsetIndexTranscriptItemCancel.events({
	'click #transcript-bonus-cancel': function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
