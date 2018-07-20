import "./filterSemester.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";
import {CourseIterations} from "../../../api/courseIterations";

/*
 * ############################################################################
 * filterItemFilterSemester
 * ############################################################################
 */

Template.filterItemFilterSemester.helpers({
	hasSemesterFilter: function () {
		return (Filter.getFilterQuery().semester !== undefined || Filter.getFilterQuery().noSemester !== undefined);
	},
	displayNoSemesterFilter: function () {
		let query = Filter.getFilterQuery();
		query.noSemester = true;
		return CourseIterations.findOne(query);
	},
	hasNoSemesterFilter: function () {
		return Filter.getFilterQuery().noSemester !== undefined;
	}
});

Template.filterItemFilterSemester.events({
	'click .noFilterSemester': function () {
		Filter.setActiveFilter(undefined, "semester");
		Filter.setActiveFilter(undefined, "noSemester");
	},
	'click .filterNoSemester': function () {
		Filter.setActiveFilter(undefined, "semester");
		Filter.setActiveFilter(true, "noSemester");
	},
	'click .filterSemester': function (event) {
		Filter.setActiveFilter(undefined, "noSemester");
		Filter.setActiveFilter($(event.target).data('id'), "semester");
	}
});
