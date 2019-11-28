import "./filterStars.html";
import {Filter} from "../../../../api/filter";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";

/*
 * ############################################################################
 * filterItemFilterStars
 * ############################################################################
 */

Template.filterItemFilterStars.helpers({
	hasRatingFilter: function () {
		return Filter.getActiveFilter().stars !== undefined;
	},
	gotStars: function (rating) {
		let activeFilter = Filter.getActiveFilter();
		let query = {};
		query.stars = rating;
		if (activeFilter.user_id !== undefined) {
			query.user_id = activeFilter.user_id;
		}
		if (activeFilter.transcriptDate !== undefined) {
			query.date = new Date(activeFilter.transcriptDate);
		}
		if (activeFilter.rating !== undefined) {
			query.rating = activeFilter.rating;
		}
		return TranscriptBonus.findOne(query);
	},
	resultsFilterStars: function (rating) {
		let activeFilter = Filter.getActiveFilter();
		if (activeFilter.stars !== undefined) {
			return rating === activeFilter.stars;
		}
	}
});

Template.filterItemFilterStars.events({
	'click .noFilterStars': function () {
		Filter.setActiveFilter(undefined, "stars");
	},
	'click .filterStars': function (evt) {
		Filter.setActiveFilter($(evt.target).data("stars"), "stars");
	}
});
