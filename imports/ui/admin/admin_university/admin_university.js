import "./admin_university.html";
import {Meteor} from "meteor/meteor";
import {CollegesCourses} from "../../../api/colleges_courses.js";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Meteor.subscribe("collegesCourses");

var edit = false;
var editCollege = "";
var editCourse = "";

Session.setDefault('adminSortCreated', {college: 1});

Template.admin_university.helpers({

	'allColleges': function () {
		if (Meteor.settings.public.university.singleUniversity) {
			return CollegesCourses.find({"college": Meteor.settings.public.university.default}, {sort: {course: 1}});
		} else {
			return CollegesCourses.find({}, {sort: {college: 1, course: 1}});
		}
	}

});

function addCollegeAndCourse() {
	var college;
	var course = document.getElementById("courseOfStudies").value;
	var deleteButton = document.createElement("input");
	if (Meteor.settings.public.university.singleUniversity) {
		college = Meteor.settings.public.university.default;
	} else {
		college = document.getElementById("college").value;
	}

	deleteButton.setAttribute("type", "button");
	deleteButton.setAttribute("id", "deleteRow");
	deleteButton.setAttribute("value", "delete");
	if (edit) {
		Meteor.call("editCollegesCourses", editCollege, editCourse, college, course);
		document.getElementById("newEntry").reset();
		Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
		edit = false;
	} else {
		if (college === "" || course === "") {
			Bert.alert(TAPi18n.__('admin-interval.errorAllFields'), 'danger', 'growl-top-left');
		} else {
			if (CollegesCourses.findOne({college: {$regex: college, $options: "i"}})) {
				if (CollegesCourses.findOne({
						college: {$regex: college, $options: "i"},
						course: {$regex: course, $options: "i"}
					})) {
					Bert.alert(TAPi18n.__('admin-interval.existingCourse'), 'danger', 'growl-top-left');
					return;
				} else {
					college = CollegesCourses.findOne({college: {$regex: college, $options: "i"}}).college;
				}
			}
			Meteor.call("updateCollegesCoursess", college, course);
			document.getElementById("newEntry").reset();
			Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
		}
	}
}

Template.admin_university.events({
	'keypress input': function (event) {
		if (event.keyCode === 13) {
			addCollegeAndCourse();
		}
	},
	'click #cancelButton': function () {
		document.getElementById("newEntry").reset();
		edit = false;
	},
	'click #deleteCollageCourse': function () {
		var result = confirm("Sind sie sich sicher?");
		if (result) {
			Meteor.call("deleteCollegesCourses", this.college, this.course);
		}
	},
	'click #editCollageCourse': function () {
		if (!Meteor.settings.public.university.singleUniversity) {
			document.getElementById("college").value = this.college;
		}
		document.getElementById("courseOfStudies").value = this.course;
		editCollege = this.college;
		editCourse = this.course;
		edit = true;
	},
	'click #insertButton': function () {
		addCollegeAndCourse();
	},
	'click #collegeTable .collegedown': function () {
		Session.set('adminSortCreated', {college: 1});
	},
	'click #collegeTable .collegeup': function () {
		Session.set('adminSortCreated', {college: -1});
	},
	'click #collegeTable .coursedown': function () {
		Session.set('adminSortCreated', {course: 1});
	},
	'click #collegeTable .courseup': function () {
		Session.set('adminSortCreated', {course: -1});
	}
});

Template.admin_university.onDestroyed(function () {
	Session.set('adminSortCreated', {college: 1});
});
