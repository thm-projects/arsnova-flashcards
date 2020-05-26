import "./cancel.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
		FlowRouter.go('cardsetdetailsid', {
			_id: FlowRouter.getParam('_id')
		});
	}
});
