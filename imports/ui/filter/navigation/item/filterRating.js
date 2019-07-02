import "./filterRating.html";
import {FilterNavigation} from "../../../../api/filterNavigation";
import {Filter} from "../../../../api/filter";
import {TranscriptBonus} from "../../../../api/transcriptBonus";

/*
 * ############################################################################
 * filterItemFilterRating
 * ############################################################################
 */

Template.filterItemFilterRating.helpers({
	hasRatingFilter: function () {
		return Filter.getActiveFilter(FilterNavigation.getRouteId()).rating !== undefined;
	},
	gotRating: function (rating) {
		let query = Filter.getFilterQuery(FilterNavigation.getRouteId());
		delete query._id;
		query.rating = rating;
		if (query.owner !== undefined) {
			query.user_id = query.owner;
			delete query.owner;
		}
		return TranscriptBonus.findOne(query);
	},
	resultsFilterRating: function (rating) {
		let activeFilter = Filter.getActiveFilter(FilterNavigation.getRouteId());
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
