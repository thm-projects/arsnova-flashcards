import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {UserPermissions} from "../../util/permissions";
import {ServerStyle} from "../../util/styles";

export const MessageOfTheDay = new Mongo.Collection("messageOfTheDay");

if (Meteor.isServer) {
	Meteor.publish("MessageOfTheDayAll", function () {
		return MessageOfTheDay.find();
	});
	Meteor.publish("MessageOfTheDayFiltered", function (isGuest) {
		if (Meteor.user() || (isGuest && ServerStyle.isLoginEnabled('guest'))) {
			return MessageOfTheDay.find({$or: [
					{locationType: 0},
					{locationType: 2}
				]});
		} else {
			return MessageOfTheDay.find({$or: [
					{locationType: 1},
					{locationType: 2}
				]});
		}
	});

	const MessageOfTheDaySchema = new SimpleSchema({
		subject: {
			type: String
		},
		content: {
			type: String
		},
		dateCreated: {
			type: Date
		},
		dateUpdated: {
			type: Date
		},
		locationType: {
			type: Number
		},
		expirationDate: {
			type: Date
		},
		publishDate: {
			type: Date
		}
	});

	MessageOfTheDay.attachSchema(MessageOfTheDaySchema);
}

MessageOfTheDay.allow({
	insert: function () {
		return UserPermissions.gotBackendAccess();
	},
	update: function () {
		return false;
	},
	remove: function () {
		return false;
	}
});

Meteor.users.deny({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});

