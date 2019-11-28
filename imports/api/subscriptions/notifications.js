import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../permissions";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const Notifications = new Mongo.Collection("notifications");

if (Meteor.isServer) {
	Meteor.publish("notifications", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Notifications.find({target: this.userId});
		} else {
			this.ready();
		}
	});

	var NotificationSchema = new SimpleSchema({
		target: {
			type: String
		},
		origin: {
			type: String
		},
		type: {
			type: String
		},
		text: {
			type: String
		},
		date: {
			type: Date
		},
		read: {
			type: Boolean
		},
		cleared: {
			type: Boolean
		},
		link_id: {
			type: String
		},
		target_type: {
			type: String
		},
		receiver: {
			type: String
		}
	});

	Notifications.attachSchema(NotificationSchema);
}
