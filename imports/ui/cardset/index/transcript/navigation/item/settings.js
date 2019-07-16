import "./settings.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardsetIndexTranscriptNavigationItemSettings
 * ############################################################################
 */

Template.cardsetIndexTranscriptNavigationItemSettings.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	}
});

Template.cardsetIndexTranscriptNavigationItemSettings.events({
	'click #showTranscriptSettings': function () {
		Session.set('transcriptViewingMode', 0);
	}
});
