import "./filterCollege.html";
import {CourseIterations} from "../../../api/courseIterations";
import {Filter} from "../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterCollege
 * ############################################################################
 */

Template.filterItemFilterCollege.helpers({
	hasCollegeFilter: function () {
		return Filter.getFilterQuery().college !== undefined;
	},
	getColleges: function () {
		let query = Filter.getFilterQuery();
		delete query.college;
		return _.uniq(CourseIterations.find(query, {sort: {"college": 1}}).fetch(), function (item) {
			return item.college;
		});
	},
	resultsFilterCollege: function (college) {
		return Filter.getActiveFilter().college === college;
	}
});

Template.filterItemFilterCollege.events({
	'click .noFilterCollege': function () {
		Filter.setActiveFilter(undefined, "college");
	},
	'click .filterCollege': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "college");
	}
});
