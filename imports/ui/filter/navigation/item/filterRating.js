import "./filterRating.html";
import {Filter} from "../../../../util/filter";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";

/*
 * ############################################################################
 * filterItemFilterRating
 * ############################################################################
 */

Template.filterItemFilterRating.helpers({
	hasRatingFilter: function () {
		return Filter.getActiveFilter().rating !== undefined;
	},
	gotRating: function (rating) {
		let activeFilter = Filter.getActiveFilter();
		let query = {};
		query.rating = rating;
		if (activeFilter.user_id !== undefined) {
			query.user_id = activeFilter.user_id;
		}
		if (activeFilter.transcriptDate !== undefined) {
			query.date = new Date(activeFilter.transcriptDate);
		}
		return TranscriptBonus.findOne(query);
	},
	resultsFilterRating: function (rating) {
		let activeFilter = Filter.getActiveFilter();
		if (activeFilter.rating !== undefined) {
			return rating === activeFilter.rating;
		}
	}
});

Template.filterItemFilterRating.events({
	'click .noFilterRating': function () {
		Filter.setActiveFilter(undefined, "rating");
	},
	'click .filterRating': function (evt) {
		Filter.setActiveFilter($(evt.target).data("rating"), "rating");
	}
});
