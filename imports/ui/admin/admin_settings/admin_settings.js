import "./admin_settings.html";
import {Colleges_Course} from "../../../api/colleges_course.js";


Meteor.subscribe("colleges_course");

Template.admin_settings.helpers({

	'allColleges': function () {

		return Colleges_Course.find({
			/*college: 1
			 },
			 {
			 course: 1
			 },
			 {
			 sort: Session.get('adminSortCreated')*/
		});
	}

});

Template.admin_settings.rendered = function () {
	var collegeA = new Array();
	var amount = console.log(Colleges_Course.find().count());
	//var name = document.getElementById("college").value;

	for (var i = 0; i <= amount; i++) {
		collegeA[i] = Colleges_Course.findOne().name;
		console.log(collegeA[i]);
	}
	$("#collegeTable").dataTable();
};

Template.admin_settings.events({
	'click #cancelButton': function (event) {
		document.getElementById("newEntry").reset();
	},
	'click #insertButton': function (event) {
		var college = document.getElementById("college").value;
		var course = document.getElementById("courseOfStudies").value;
		var deleteButton = document.createElement("input");
		deleteButton.setAttribute("type", "button");
		deleteButton.setAttribute("id", "deleteRow");
		deleteButton.setAttribute("value", "delete");
		var delete_Button = document.getElementById("deleteRow");
		Meteor.call("updateColleges_Courses", college, course);
		document.getElementById("newEntry").reset();
	}/*,
	 'click #deleteRow': function (event) {
	 document.getElementById("deleteRow").deleteRow(-1);
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
	 }*/
});