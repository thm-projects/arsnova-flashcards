import {Meteor} from "meteor/meteor";
import {WebPushNotifications} from "./webPushSubscriptions";

export let CardsetNavigation = class CardsetNavigation {
	/**
	 * Add the current user to the leitner algorithm.
	 */
	static addToLeitner (cardset_id) {
		WebPushNotifications.subscribeForPushNotification();
		Meteor.call('addToLeitner', cardset_id);
	}
};
