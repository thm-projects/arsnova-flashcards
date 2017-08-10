import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const Cloud = new Mongo.Collection("wordcloud");

if (Meteor.isServer) {
	Meteor.publish("wordcloud", function () {
		return Cloud.find({}, {fields: {_id: 1, list: 1}});
	});
}
