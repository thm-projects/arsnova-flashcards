import "./filterCollege.html";
import {CourseIterations} from "../../../api/courseIterations";
import {Filter} from "../../../api/filter";
import {TargetAudience} from "../../../api/targetAudience";

/*
 * ############################################################################
 * filterItemFilterCollege
 * ############################################################################
 */

Template.filterItemFilterCollege.helpers({
	hasCollegeFilter: function () {
		return (Filter.getFilterQuery().college !== undefined || Filter.getFilterQuery().noModule !== undefined);
	},
	hasNoCollegeFilter: function () {
		return Filter.getFilterQuery().noModule !== undefined;
	},
	getColleges: function () {
		let query = Filter.getFilterQuery();
		delete query.college;
		delete query.noModule;
		query.targetAudience = {$in: TargetAudience.getTargetAudienceWithModule()};
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
		Filter.setActiveFilter(undefined, "noModule");
	},
	'click .filterNoCollege': function () {
		Filter.setActiveFilter(undefined, "college");
		Filter.setActiveFilter(true, "noModule");
	},
	'click .filterCollege': function (event) {
		Filter.setActiveFilter(undefined, "noModule");
		Filter.setActiveFilter($(event.target).data('id'), "college");
	}
});
