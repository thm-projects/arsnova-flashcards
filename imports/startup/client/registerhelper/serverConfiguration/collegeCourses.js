import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {CollegesCourses} from "../../../../api/subscriptions/collegesCourses";

// Check if multiple universities are enabled
Template.registerHelper("singleUniversity", function () {
	return Meteor.settings.public.university.singleUniversity;
});

// Returns all courses
Template.registerHelper("getCourses", function () {
	var query = {};
	if (Session.get('poolFilterCollege')) {
		query.college = Session.get('poolFilterCollege');
	}
	return _.uniq(CollegesCourses.find(query, {sort: {course: 1}}).fetch(), function (item) {
		return item.course;
	});
});

//Returns all Colleges
Template.registerHelper("getColleges", function () {
	return _.uniq(CollegesCourses.find({}, {sort: {college: 1}}).fetch(), function (item) {
		return item.college;
	});
});

// Return the name of a College
Template.registerHelper("getCollege", function (value) {
	if (value !== null) {
		var id = value.toString();
		if (id.length === 1) {
			id = "0" + id;
		}

		var college = CollegesCourses.findOne(id);
		if (college !== undefined) {
			return college.name;
		}
	}
});
