import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Authors = new Mongo.Collection("authors");

if (Meteor.isServer) {
	Meteor.publish("authors", function () {
		return Authors.find();
	});
}
