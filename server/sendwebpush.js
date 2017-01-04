import {Notifications} from "./notifications.js";
import {Learned} from "../imports/api/learned.js";

export class WebNotifier {

	getDeadline (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var active = Learned.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			var deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return (TAPi18n.__('notifications.deadline') + cardset.learningEnd.toLocaleDateString());
			} else {
				return (TAPi18n.__('notifications.deadline') + deadline.toLocaleDateString() + TAPi18n.__('notifications.warning'));
			}
		}
	}

	prepareWeb (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var notifier = new Notifications();
			var message = TAPi18n.__('notifications.content') + cardset.name + TAPi18n.__('notifications.cards') + notifier.getActiveCardsCount(cardset._id, user_id) + this.getDeadline(cardset, user_id);
			console.log(message);
			Meteor.call("sendPushNotificationsToUser", user_id, message);
		}
	}
}
