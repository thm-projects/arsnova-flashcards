import './frontendNotification.html';
import {MessageOfTheDay} from "../../../../../../api/subscriptions/messageOfTheDay";
import {openMessage} from "../../../../../messageOfTheDay/messageOfTheDay";

Template.frontendNotification.helpers({
	getMessages: function () {
		// get all messages that already published and not expired
		let messages = MessageOfTheDay.find({$and: [
				{publishDate: {$lte: new Date()}},
				{expirationDate: {$gte: new Date()}}
			]}).fetch();
		if (messages.length === 0) {
			$('#fallbackTR').show();
		} else {
			$('#fallbackTR').hide();
		}
		return messages;
	}
});

Template.frontendNotification.events({
	'click #messageTR': function () {
		openMessage(this);
	}
});
