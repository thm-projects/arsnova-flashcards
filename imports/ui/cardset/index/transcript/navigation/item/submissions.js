import "./submissions.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardsetIndexTranscriptNavigationItemSubmissions
 * ############################################################################
 */

Template.cardsetIndexTranscriptNavigationItemSubmissions.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	}
});

Template.cardsetIndexTranscriptNavigationItemSubmissions.events({
	'click #showTranscriptSubmissions': function () {
		Session.set('transcriptViewingMode', 2);
	}
});
