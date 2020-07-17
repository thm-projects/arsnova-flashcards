import {Meteor} from "meteor/meteor";
import {WebPushSubscriptions} from "../subscriptions/webPushNotifications";
import webPush from "web-push";

Meteor.methods({
	/**
	 * Stores a web push subscription for the current user in the "webPushSubscriptions" collection.
	 * Each user has a list of subscriptions, one per device.
	 * @param {Object} subscription The subscription of the service workers pushManager
	 * @param {string} subscription.endpoint endpoint of the subscription
	 * @param {string} subscription.key key of the subscription
	 * @param {string} subscription.authSecret auth secret of the subscription
	 */
	addWebPushSubscription: function (subscription) {
		WebPushSubscriptions.upsert({user_id: Meteor.userId()}, {
			$addToSet: {subscriptions: subscription}
		});
	},

	/**
	 * Sends a push notification to each subscribed device of a particular user.
	 * @param userId the ID of the user
	 * @param message the message displayed in the push notification
	 */
	sendPushNotificationsToUser: function (userId, message) {
		webPush.setGCMAPIKey(Meteor.settings.private.FCM_API_KEY);
		let data = WebPushSubscriptions.findOne({user_id: userId});
		data.subscriptions.forEach(function (sub) {
			let subscription = {
				endpoint: sub.endpoint,
				keys: {
					p256dh: sub.key,
					auth: sub.authSecret
				}
			};
			webPush.sendNotification(subscription, message).catch((err) => {
				if (err.statusCode !== 201 && err.statusCode !== 401 && err.statusCode !== 410) {
					throw err;
				}
			});
		});
	}
});
