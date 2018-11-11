import {Meteor} from "meteor/meteor";
import {Notifications} from "./notifications.js";
import {Leitner} from "../imports/api/learned.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {Cardsets} from "../imports/api/cardsets.js";

function getDateString(date) {
	let dateFormat = "D. MMMM YYYY";
	return moment(date).locale(Meteor.settings.mail.language).format(dateFormat);
}

/**
 * Class used for generating the text of web-push notifications
 */
export class WebNotifier {

	/** Function returns the deadline text-message depending on if the deadline goes beyond the cardsets learning-phase
	 *  @param {Object} cardset - The cardset object for the deadline
	 *  @param {string} user_id - The id of the user
	 *  @param {string} testUser - id of the test user if the function got called by a test notification
	 *  @returns {string} - The deadline text-message
	 * */
	getDeadline (cardset, user_id, testUser = undefined) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (testUser !== undefined) {
				user_id = testUser;
			}
			let active = Leitner.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			let deadline = new Date();
			if (active !== undefined) {
				deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			}
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return getDateString(cardset.learningEnd);
			} else {
				return getDateString(deadline);
			}
		}
	}

	/** Function creates and sends the Web-Push payload message
	 *  @param {Object} cardset - The cardset from the active learning-phase
	 *  @param {string} user_id - The id of the user
	 *  @param {string} testUser - id of the test user if the function got called by a test notification
	 * */
	prepareWeb (cardset, user_id, testUser = undefined) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let notifier = new Notifications();
			let message = TAPi18n.__('webPushNotifications.content', {cardsetName: cardset.name, cardCount: notifier.getActiveCardsCount(cardset._id, user_id, testUser), deadline: this.getDeadline(cardset, user_id, testUser)}, Meteor.settings.mail.language);
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
		web.prepareWeb(cardset, settings.target, settings.testUserID);
	}
});
