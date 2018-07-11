import "./filterSemester.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterSemester
 * ############################################################################
 */

Template.filterItemFilterSemester.helpers({
	hasSemesterFilter: function () {
		return Filter.getFilterQuery().semester !== undefined;
	}
});

Template.filterItemFilterSemester.events({
	'click .noFilterSemester': function () {
		Filter.setActiveFilter(undefined, "semester");
	},
	'click .filterSemester': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "semester");
	}
});
