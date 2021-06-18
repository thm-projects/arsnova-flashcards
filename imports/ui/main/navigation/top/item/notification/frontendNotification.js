import './frontendNotification.html';
import {MessageOfTheDay} from "../../../../../../api/subscriptions/messageOfTheDay";
import {openMessage} from "../../../../../messageOfTheDay/messageOfTheDay";
import {Mongo} from "meteor/mongo";
import { Cards } from '../../../../../../api/subscriptions/cards';

const OwnErrorReportings = new Mongo.Collection("errorReporting");

function getErrorMessage(reporting) {
	let errors = '<ul>';
	console.log(reporting);
	if (reporting.error.type.includes(0)) {
		errors += `<li>${TAPi18n.__('modal-card.errorReporting.spellingMistake')}</li>`;
	}
	if (reporting.error.type.includes(1)) {
		errors += `<li>${TAPi18n.__('modal-card.errorReporting.missingPicture')}</li>`;
	}
	if (reporting.error.type.includes(2)) {
		errors += `<li>${TAPi18n.__('modal-card.errorReporting.layoutMistake')}</li>`;
	}
	if (reporting.error.type.includes(3)) {
		errors += `<li>${TAPi18n.__('modal-card.errorReporting.brokenLink')}</li>`;
	}
	if (reporting.error.content.length) {
		errors += `<li>${TAPi18n.__('modal-card.errorReporting.otherError')}:<br />${reporting.error.content}</li>`;
	}
	return errors;
}

Template.frontendNotification.helpers({
	getMessages: function () {
		// get all messages that already published and not expired
		let messages = MessageOfTheDay.find({$and: [
				{publishDate: {$lte: new Date()}},
				{expirationDate: {$gte: new Date()}}
			]}).fetch();
		for (const reporting of OwnErrorReportings.find({}).fetch()) {
			messages.push({subject: TAPi18n.__('modal-card.errorReporting.errorNotificationHeader') + Cards.findOne({_id: reporting.card_id}).subject, content: `<div>
			${TAPi18n.__('modal-card.errorReporting.reportedErrorsNotification')}
			${getErrorMessage(reporting)}
			<a target="_self" rel="noopener noreferrer" href="/cardset/${reporting.cardset_id}">${TAPi18n.__('modal-card.errorReporting.openCardNotification')}</a>
			</div>`});
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
