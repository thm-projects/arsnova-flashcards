import {Meteor} from "meteor/meteor";
import {Notifications} from "./notifications.js";
import {Learned} from "../imports/api/learned.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {Cardsets} from "../imports/api/cardsets.js";

/**
 * Class used for generating the text of web-push notifications
 */
export class WebNotifier {

	/** Function returns the deadline text-message depending on if the deadline goes beyond the cardsets learning-phase
	 *  @param {string} cardset_id - The id of the cardset
	 *  @param {string} user_id - The id of the user
	 *  @returns {string} - The deadline text-message
	 * */
	getDeadline (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var active = Learned.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			var deadline = new Date();
			if (active !== undefined) {
				deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			}
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return (TAPi18n.__('notifications.deadline') + cardset.learningEnd.toLocaleDateString());
			} else {
				return (TAPi18n.__('notifications.deadline') + deadline.toLocaleDateString() + TAPi18n.__('notifications.warning'));
			}
		}
	}

	/** Function creates and sends the Web-Push payload message
	 *  @param {Object} cardset - The cardset from the active learning-phase
	 *  @param {string} user_id - The id of the user
	 * */
	prepareWeb (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var notifier = new Notifications();
			var message = TAPi18n.__('notifications.content') + cardset.name + TAPi18n.__('notifications.cards') + notifier.getActiveCardsCount(cardset._id, user_id) + this.getDeadline(cardset, user_id);
			Meteor.call("sendPushNotificationsToUser", user_id, message);
		}
	}
}

Meteor.methods({
	sendTestWebNotification: function () {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		let web = new WebNotifier();
		let settings = AdminSettings.findOne({name: "testNotifications"});
		let cardset = Cardsets.findOne({_id: settings.testCardsetID});
		web.prepareWeb(cardset, settings.target);
	}
});
