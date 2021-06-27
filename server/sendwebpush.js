import {Meteor} from "meteor/meteor";
import {Notifications} from "./notifications.js";
import {AdminSettings} from "../imports/api/subscriptions/adminSettings.js";
import {Cardsets} from "../imports/api/subscriptions/cardsets.js";
import {ServerStyle} from "../imports/util/styles";
import {LeitnerLearningWorkloadUtilities} from "../imports/util/learningWorkload";
import {LeitnerLearningPhase} from "../imports/api/subscriptions/leitner/leitnerLearningPhase";

/**
 * Class used for generating the text of web-push notifications
 */
export class WebNotifier {
	/** Function creates and sends the Web-Push payload message
	 * @param {Object} cardset - The cardset from the active learning-phase
	 * @param {string} user_id - The id of the user
	 * @param {Object} learningPhase - The active learning phase that the user belongs to
	 * @param {string} testUser - id of the test user if the function got called by a test notification
	 * @param {number} messageType 0 = new, 1 = reminder, 2 = reset
	 * */
	prepareWeb (cardset, user_id, learningPhase, testUser = undefined, messageType = 0) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let message;
			let deadlineUser = user_id;
			if (testUser !== undefined) {
				deadlineUser = testUser;
			}
			let leitnerWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset._id, deadlineUser);
			switch (messageType) {
				case 1:
					message = TAPi18n.__('notifications.webPush.reminder', {
						cardset: cardset.name,
						cards: Notifications.getActiveCardsCount(leitnerWorkload, deadlineUser),
						deadline: Notifications.getDeadline(learningPhase, leitnerWorkload, deadlineUser)},
						ServerStyle.getServerLanguage()
					);
					break;
				case 2:
					message = TAPi18n.__('notifications.webPush.reset', {
						cardset: cardset.name,
						cards: Notifications.getActiveCardsCount(leitnerWorkload, deadlineUser),
						deadline: Notifications.getDeadline(learningPhase, leitnerWorkload, deadlineUser)},
						ServerStyle.getServerLanguage()
					);
					break;
				default:
					message = TAPi18n.__('notifications.webPush.new', {
						cardset: cardset.name,
						cards: Notifications.getActiveCardsCount(leitnerWorkload, deadlineUser),
						deadline: Notifications.getDeadline(learningPhase, leitnerWorkload, deadlineUser)},
						ServerStyle.getServerLanguage()
					);
			}
			Meteor.call("sendPushNotificationsToUser", user_id, message);
		}
	}
}

Meteor.methods({
	sendTestWebNotification: function (messageType = 0) {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		let web = new WebNotifier();
		let settings = AdminSettings.findOne({name: "testNotifications"});
		let cardset = Cardsets.findOne({_id: settings.testCardsetID});
		const learningPhase = LeitnerLearningPhase.findOne({cardset_id: cardset._id});
		web.prepareWeb(cardset, settings.target, learningPhase, settings.testUserID, messageType);
	}
});
