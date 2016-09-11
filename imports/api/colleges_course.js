import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const Colleges_Course = new Mongo.Collection("colleges_course");

if (Meteor.isServer) {
	Meteor.publish("colleges_course", function () {
		return Colleges_Course.find({});
	});
}

Meteor.methods({
	"updateColleges_Courses": function (college, course) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		Colleges_Course.insert({
			"college": college,
			"course": course

		});
	}

});
