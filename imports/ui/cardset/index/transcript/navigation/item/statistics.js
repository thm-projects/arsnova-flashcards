import "./statistics.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardsetIndexTranscriptNavigationItemStatistics
 * ############################################################################
 */

Template.cardsetIndexTranscriptNavigationItemStatistics.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	}
});

Template.cardsetIndexTranscriptNavigationItemStatistics.events({
	'click #showTranscriptStatistics': function () {
		Session.set('transcriptViewingMode', 1);
	}
});
