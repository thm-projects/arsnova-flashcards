import "./filterCourse.html";
import {CourseIterations} from "../../../api/courseIterations";
import {Filter} from "../../../api/filter";
import {TargetAudience} from "../../../api/targetAudience";

/*
 * ############################################################################
 * filterItemFilterCourse
 * ############################################################################
 */

Template.filterItemFilterCourse.helpers({
	hasCourseFilter: function () {
		return (Filter.getFilterQuery().course !== undefined || Filter.getFilterQuery().noModule !== undefined);
	},
	hasNoCourseFilter: function () {
		return Filter.getFilterQuery().noModule !== undefined;
	},
	getCourses: function () {
		let query = Filter.getFilterQuery();
		delete query.course;
		delete query.noModule;
		query.targetAudience = {$in: TargetAudience.getTargetAudienceWithModule()};
		return _.uniq(CourseIterations.find(query, {sort: {"course": 1}}).fetch(), function (item) {
			return item.course;
		});
	},
	resultFilterCourse: function (course) {
		return Filter.getActiveFilter().course === course;
	}
});

Template.filterItemFilterCourse.events({
	'click .noFilterCourse': function () {
		Filter.setActiveFilter(undefined, "course");
		Filter.setActiveFilter(undefined, "noModule");
	},
	'click .filterNoCourse': function () {
		Filter.setActiveFilter(undefined, "course");
		Filter.setActiveFilter(true, "noModule");
	},
	'click .filterCourse': function (event) {
		Filter.setActiveFilter(undefined, "noModule");
		Filter.setActiveFilter($(event.target).data('id'), "course");
	}
});
