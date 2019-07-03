import "./user.html";
import "./user/accepted.js";
import "./user/author.js";
import "./user/bonus.js";
import "./user/denied.js";
import "./user/lastSubmission.js";
import "./user/pending.js";
import "./user/submissions.js";
import {FilterNavigation} from "../../../../../../api/filterNavigation";
import {Filter} from "../../../../../../api/filter";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUser
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUser.events({
	'click .filterTranscriptSubmissions': function (event) {
		Session.set('transcriptViewingMode', 2);
		Filter.setActiveFilter($(event.target).data('id'), "author", 30);
		FilterNavigation.showDropdown();
	},
	'click .filterSubmissionsRating': function (event) {
		Session.set('transcriptViewingMode', 2);
		Filter.setActiveFilter($(event.target).data('id'), "author", 30);
		Filter.setActiveFilter($(event.target).data('rating'), "rating", 30);
		FilterNavigation.showDropdown();
	}
});
