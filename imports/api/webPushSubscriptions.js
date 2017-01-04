import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const WebPushSubscriptions = new Mongo.Collection("webPushSubscriptions");

Meteor.methods({
	addWebPushSubscription: function (subscription) {
		WebPushSubscriptions.upsert({userId: Meteor.userId()}, {
			$addToSet: {subscriptions: subscription}
		});
	}
});