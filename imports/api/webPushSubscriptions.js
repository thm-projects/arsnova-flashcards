import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import webPush from 'web-push';

export const WebPushSubscriptions = new Mongo.Collection("webPushSubscriptions");

Meteor.methods({
	addWebPushSubscription: function (subscription) {
		WebPushSubscriptions.upsert({userId: Meteor.userId()}, {
			$addToSet: {subscriptions: subscription}
		});
	},

	sendPushNotificationsToUser: function (userId, message) {
		webPush.setGCMAPIKey(Meteor.settings.private.FCM_API_KEY);
		var data = WebPushSubscriptions.findOne({userId: userId});
		data.subscriptions.forEach(function (sub) {
			var subscription = {
				endpoint: sub.endpoint,
				keys: {
					p256dh: sub.key,
					auth: sub.authSecret
				}
			};
			console.log(subscription);
			webPush.sendNotification(subscription, message);
		});
	}

});
