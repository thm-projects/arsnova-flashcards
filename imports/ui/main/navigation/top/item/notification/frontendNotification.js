import './frontendNotification.html';
import {MessageOfTheDay} from "../../../../../../api/subscriptions/messageOfTheDay";
import {openMessage} from "../../../../../messageOfTheDay/messageOfTheDay";
import {Mongo} from "meteor/mongo";

const OwnErrorReportings = new Mongo.Collection("errorReporting");

Template.frontendNotification.helpers({
	getMessages: function () {
		// get all messages that already published and not expired
		let messages = MessageOfTheDay.find({$and: [
				{publishDate: {$lte: new Date()}},
				{expirationDate: {$gte: new Date()}}
			]}).fetch();
		for (const reporting of OwnErrorReportings.find({}).fetch()) {
			messages.push({subject: `Error reporting: ${reporting.error.content === "" ? reporting.error.type : reporting.error.content}`});
		}
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

Tracker.autorun(() => Meteor.subscribe("ownError"));
