import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Colleges_Courses = new Mongo.Collection("colleges_courses");

if (Meteor.isServer) {
	Meteor.publish("colleges_courses", function () {
		return Colleges_Courses.find();
	});
}
