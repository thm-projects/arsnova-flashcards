import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import webPush from 'web-push';

export const WebPushSubscriptions = new Mongo.Collection("webPushSubscriptions");

export let WebPushNotifications = class WebPushNotifications {
	/**
	 * Creates a web push subscription for the current device.
	 * The Browser ask the user for permissions and creates the subscription.
	 * Afterwards the subscription will be saved for the current user via the
	 * Meteor-method addWebPushSubscription.
	 */
	static subscribeForPushNotification () {
		try {
			navigator.serviceWorker.getRegistration()
				.then(function (registration) {
					return registration.pushManager.getSubscription()
						.then(function () {
							return registration.pushManager.subscribe({userVisibleOnly: true});
						});
				})
				.then(function (subscription) {
					if (subscription) {
						let rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
						const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
						let rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
						const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
						const endpoint = subscription.endpoint;
						const sub = {
							endpoint: endpoint,
							key: key,
							authSecret: authSecret
						};
						Meteor.call("addWebPushSubscription", sub, function (error) {
							if (error) {
								throw new Meteor.Error(error.statusCode, 'Error subscription failed');
							}
						});
					}
				});
		} catch (error) {
			console.log(error);
		}
	}
};

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
		var data = WebPushSubscriptions.findOne({user_id: userId});
		data.subscriptions.forEach(function (sub) {
			var subscription = {
				endpoint: sub.endpoint,
				keys: {
					p256dh: sub.key,
					auth: sub.authSecret
				}
			};
			webPush.sendNotification(subscription, message)
				.then(function (response) {
					if (response.statusCode !== 200 && response.statusCode !== 201) {
						console.log("FCM push notification request failed", response.body);
					}
				});
		});
	}
});
