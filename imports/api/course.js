import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Course = new Mongo.Collection("course");

if (Meteor.isServer) {
	Meteor.publish("course", function () {
		return Course.find();
	});
}

Meteor.methods({
	updateCourse: function (name) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		Course.insert(
			{
				name: name
			});
	}
});
