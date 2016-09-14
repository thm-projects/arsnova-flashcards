import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const Colleges_Courses = new Mongo.Collection("colleges_courses");

if (Meteor.isServer) {
	Meteor.publish("colleges_courses", function () {
		return Colleges_Courses.find({});
	});
}

Meteor.methods({
	"updateColleges_Coursess": function (college, course) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		Colleges_Courses.insert({
			"college": college,
			"course": course

		});
	},
	"deleteColleges_Courses": function (college, course) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		Colleges_Courses.remove({
			"college": college,
			"course": course

		});
	},
	"editColleges_Courses": function (college, course, newCollege, newCourse) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		Colleges_Courses.update({
			"college": college,
			"course": course
		},{
			$set: {
				"college": newCollege,
				"course": newCourse
			}
		}
		);
	}

});
