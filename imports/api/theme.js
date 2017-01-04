import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const ColorThemes = new Mongo.Collection("colorThemes");

if (Meteor.isServer) {
	Meteor.publish("colorThemes", function () {
		return ColorThemes.find();
	});
}
