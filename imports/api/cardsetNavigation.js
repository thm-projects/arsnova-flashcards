import {Meteor} from "meteor/meteor";

export let CardsetNavigation = class CardsetNavigation {
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
						var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
						const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
						var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
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

	/**
	 * Add the current user to the leitner algorithm.
	 */
	static addToLeitner (cardset_id) {
		this.subscribeForPushNotification();
		Meteor.call('addToLeitner', cardset_id);
	}
};
