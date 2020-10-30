import {UserPermissions} from "../../util/permissions";
import {MessageOfTheDay} from "../subscriptions/messageOfTheDay";
import {check} from "meteor/check";

Meteor.methods({
	insertMessageOfTheDay: function (message) {
		if (UserPermissions.gotBackendAccess()) {
			check(message.dateCreated, Date);
			check(message.dateUpdated, Date);
			check(message.expirationDate, Date);
			check(message.publishDate, Date);
			check(message.locationType, Number);
			MessageOfTheDay.insert(message);
		}
	},
	removeMessageOfTheDay: function (id) {
		if (UserPermissions.gotBackendAccess()) {
			MessageOfTheDay.remove({
				_id: id
			});
		}
	},
	updateMessageOfTheDay: function (message) {
		if (UserPermissions.gotBackendAccess()) {
			MessageOfTheDay.update({
				_id: message.id
			},{$set: {
					subject: message.subject,
					content: message.content,
					dateUpdated: new Date(),
					locationType: message.locationType,
					expirationDate: message.expirationDate,
					publishDate: message.publishDate
				}
			});
		}
	}
});
