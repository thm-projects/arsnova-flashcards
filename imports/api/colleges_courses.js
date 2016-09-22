import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";


export const CollegesCourses = new Mongo.Collection("collegesCourses");

if (Meteor.isServer) {
	if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
		Meteor.publish("collegesCourses", function () {
			return CollegesCourses.find();
		});
	}
}

Meteor.methods({
	"updateCollegesCoursess": function (college, course) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		CollegesCourses.insert({
			"college": college,
			"course": course

		});
	},
	"deleteCollegesCourses": function (college, course) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		CollegesCourses.remove({
			"college": college,
			"course": course

		});
	},
	"editCollegesCourses": function (college, course, newCollege, newCourse) {
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
