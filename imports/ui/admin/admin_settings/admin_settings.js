import "./admin_settings.html";
import {Colleges_Courses} from "../../../api/colleges_courses.js";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Meteor.subscribe("colleges_courses");

var edit = false;
var editCollege = "";
var editCourse = "";

Session.setDefault('adminSortCreated', {college: 1});

Template.admin_settings.helpers({

	'allColleges': function () {
		return Colleges_Courses.find({
			/*sort: Session.get('adminSortCreated')*/
		});
	}

});
/*
 Template.admin_settings.rendered = function () {
 var collegeA = [];
 var amount = console.log(Colleges_Courses.find().count());
 //var name = document.getElementById("college").value;

 for (var i = 0; i <= amount; i++) {
 collegeA[i] = Colleges_Courses.findOne().name;
 //console.log(collegeA[i]);
 }
 $("#collegeTable").dataTable();
 };*/

function addCollegeAndCourse() {
	var college = document.getElementById("college").value;
	var course = document.getElementById("courseOfStudies").value;
	var deleteButton = document.createElement("input");
	deleteButton.setAttribute("type", "button");
	deleteButton.setAttribute("id", "deleteRow");
	deleteButton.setAttribute("value", "delete");
	if (edit === true) {
		Meteor.call("editColleges_Courses", editCollege, editCourse, college, course);
		document.getElementById("newEntry").reset();
		Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-bottom-right');
		edit = false;
	} else {
		if (college === "" || course === "") {
			Bert.alert(TAPi18n.__('admin-intervall.errorAllFields'), 'danger', 'growl-bottom-right');
		} else {
			if (Colleges_Courses.findOne({college: college})) {
				//Hochschule existiert
				//console.log("Hochschule existiert");
				const regexp = new RegExp(course, "i");
				var countEverything = Colleges_Courses.find({college: college, course: {$in: [regexp]}}).count();
				if (countEverything > 0) {
					Bert.alert(TAPi18n.__('admin-intervall.existingCourse'), 'danger', 'growl-bottom-right');
				} else {
					//console.log(Colleges_Courses.findOne({college: college}).course.toLowerCase());
					Meteor.call("updateColleges_Coursess", college, course);
					document.getElementById("newEntry").reset();
					Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-bottom-right');
				}
			} else {
				//Hochschule existiert noch nicht
				//console.log("Hoschule existiert nicht");
				Meteor.call("updateColleges_Coursess", college, course);
				document.getElementById("newEntry").reset();
				Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-bottom-right');
			}
		}
	}
}

Template.admin_settings.events({
	'keypress input': function (event) {
		if (event.keyCode == 13) {
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
			Meteor.call("deleteColleges_Courses", this.college, this.course);
		}
	},
	'click #editCollageCourse': function () {
		document.getElementById("college").value = this.college;
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

Template.admin_settings.onDestroyed(function () {
	Session.set('adminSortCreated', {college: 1});
});
