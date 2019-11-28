import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";

export const CollegesCourses = new Mongo.Collection("collegesCourses");

if (Meteor.isServer) {
	let universityFilter = {$ne: null};
	if (Meteor.settings.public.university.singleUniversity) {
		universityFilter = Meteor.settings.public.university.default;
	}
	Meteor.publish("collegesCourses", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			return CollegesCourses.find({college: universityFilter});
		}
	});
}
