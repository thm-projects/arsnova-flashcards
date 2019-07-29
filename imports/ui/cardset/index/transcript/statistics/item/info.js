import "./info.html";
import "./box/accepted.js";
import "./box/author.js";
import "./box/bonus.js";
import "./box/cardset.js";
import "./box/denied.js";
import "./box/lastSubmission.js";
import "./box/pending.js";
import "./box/submissions.js";
import "./box/starsMedian.js";
import "./box/starsTotal.js";
import {FilterNavigation} from "../../../../../../api/filterNavigation";
import {Filter} from "../../../../../../api/filter";
import {Route} from "../../../../../../api/route";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemInfo
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemInfo.events({
	'click .filterTranscriptSubmissions': function (event) {
		Session.set('transcriptViewingMode', 2);
		if (Route.isTranscriptBonus()) {
			Filter.setActiveFilter($(event.target).data('user'), "user_id", 30);
		} else {
			Filter.setActiveFilter($(event.target).data('cardset'), "cardset_id", 30);
		}
		Filter.setActiveFilter(undefined, "rating", 30);
		FilterNavigation.showDropdown();
	},
	'click .filterSubmissionsRating': function (event) {
		Session.set('transcriptViewingMode', 2);
		if (Route.isTranscriptBonus()) {
			Filter.setActiveFilter($(event.target).data('user'), "user_id", 30);
		} else {
			Filter.setActiveFilter($(event.target).data('cardset'), "cardset_id", 30);
		}
		Filter.setActiveFilter($(event.target).data('rating'), "rating", 30);
		FilterNavigation.showDropdown();
	}
});
