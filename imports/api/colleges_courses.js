import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const CollegesCourses = new Mongo.Collection("collegesCourses");

if (Meteor.isServer) {
	Meteor.publish("collegesCourses", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return CollegesCourses.find({"college": Meteor.settings.public.university.default});
			} else {
				return CollegesCourses.find();
			}
		}
	});
}

Meteor.methods({
	"updateCollegesCoursess": function (college, course) {
		if (Meteor.settings.public.university.singleUniversity) {
			college = Meteor.settings.public.university.default;
		}
		check(college, String);
		check(course, String);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		CollegesCourses.insert({
			"college": college,
			"course": course

		});
	},
	"deleteCollegesCourses": function (college, course) {
		if (Meteor.settings.public.university.singleUniversity) {
			college = Meteor.settings.public.university.default;
		}
		check(college, String);
		check(course, String);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		CollegesCourses.remove({
			"college": college,
			"course": course

		});
	},
	"editCollegesCourses": function (college, course, newCollege, newCourse) {
		if (Meteor.settings.public.university.singleUniversity) {
			college = Meteor.settings.public.university.default;
		}
		check(college, String);
		check(course, String);
		check(newCollege, String);
		check(newCourse, String);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		CollegesCourses.update({
				"college": college,
				"course": course
			}, {
				$set: {
					"college": newCollege,
					"course": newCourse
				}
			}
		);
	}

});
