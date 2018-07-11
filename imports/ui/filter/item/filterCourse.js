import "./filterCourse.html";
import {CourseIterations} from "../../../api/courseIterations";
import {Filter} from "../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterCourse
 * ############################################################################
 */

Template.filterItemFilterCourse.helpers({
	hasCourseFilter: function () {
		return Filter.getFilterQuery().course !== undefined;
	},
	getCourses: function () {
		let query = Filter.getFilterQuery();
		delete query.course;
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
	},
	'click .filterCourse': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "course");
	}
});
