import "./filterLecturerAuthorized.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../api/filter";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

/*
 * ############################################################################
 * filterItemFilterLecturerAuthorized
 * ############################################################################
 */

Template.filterItemFilterLecturerAuthorized.helpers({
	hasLecturerAuthorizedFilter: function () {
		return Filter.getFilterQuery().lecturerAuthorized !== undefined;
	},
	resultsFilterLecturerAuthorized: function (lecturerAuthorized) {
		return Filter.getFilterQuery().lecturerAuthorized === lecturerAuthorized;
	},
	gotLecturerAuthorizedCardsets: function () {
		let query = Filter.getFilterQuery();
		query.lecturerAuthorized = true;
		return Cardsets.findOne(query);
	},
	gotNotLecturerAuthorizedCardsets: function () {
		let query = Filter.getFilterQuery();
		query.lecturerAuthorized = false;
		return Cardsets.findOne(query);
	}
});

Template.filterItemFilterLecturerAuthorized.events({
	'click .noFilterLecturerAuthorized': function () {
		Filter.setActiveFilter(undefined, "lecturerAuthorized");
	},
	'click .filterLecturerAuthorized': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "lecturerAuthorized");
	}
});
