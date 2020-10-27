import "./messageOfTheDay.html";
import "./messageOfTheDay.scss";
import {MessageOfTheDay} from "../../../api/subscriptions/messageOfTheDay";
import {ReactiveDict} from 'meteor/reactive-dict';

let message = new ReactiveDict();
let isEdit;

// helper to toggle buttons active class
function toggleActiveClass(location) {
	switch (location) {
		case 0:
			$('#toggleLoggedOut').removeClass('activeToggle');
			$('#toggleBothLocations').removeClass('activeToggle');
			$('#toggleLoggedIn').addClass('activeToggle');
			break;
		case 1:
			$('#toggleLoggedIn').removeClass('activeToggle');
			$('#toggleBothLocations').removeClass('activeToggle');
			$('#toggleLoggedOut').addClass('activeToggle');
			break;
		case 2:
			$('#toggleLoggedIn').removeClass('activeToggle');
			$('#toggleLoggedOut').removeClass('activeToggle');
			$('#toggleBothLocations').addClass('activeToggle');
			break;
	}
}

Template.admin_messageOfTheDay.helpers({
	getMessages: function () {
		let messages =  [];
		messages = MessageOfTheDay.find().fetch();
		messages.forEach(message => {
			message.dateCreated = moment(message.dateCreated).format("YYYY-MM-DD");
			message.publishDate = moment(message.publishDate).format("YYYY-MM-DD");
			message.expirationDate = moment(message.expirationDate).format("YYYY-MM-DD");
		});
		return messages;
	},
	// translate location types to text
	getLocation: function (location) {
		switch (location) {
			case 0:
				return 'angemeldet';
			case 1:
				return 'landing-page';
			case 2:
				return 'überall';
		}
	}
});
Template.admin_messageOfTheDay.events({
	'click #deleteMessage': function () {
		document.getElementById(this._id).remove();
		Meteor.call('removeMessageOfTheDay', this._id);
	},
	'click #editMessage': function () {
		isEdit = true;
		message.set('id', this._id);
		message.set('subject', this.subject);
		message.set('content', this.content);
		message.set('publishDate', this.publishDate);
		message.set('expirationDate', this.expirationDate);
		message.set('locationType', this.locationType);
		$('#motdAddAndEdit').modal('show');
	},
	'click #createMessage': function () {
		isEdit = false;
		toggleActiveClass(0);
		message.set('locationType', 0);
		message.set('publishDate', moment(new Date()).format("YYYY-MM-DD"));
		$('#motdAddAndEdit').modal('show');
	}
});

Template.motdAddAndEdit.helpers({
	getTitle: function () {
		return message.get('subject');
	},
	getContent: function () {
		return message.get('content');
	},
	getPublishDate: function () {
		return message.get('publishDate');
	},
	getExpirationDate: function () {
		return message.get('expirationDate');
	},
	setupDateAndActiveClass: function () {
		toggleActiveClass(message.get('locationType'));
	}
});
Template.motdAddAndEdit.events({
	'click #publishMessage': function () {
		if ($('#expirationDate').val() === '' ||
			$('#subjectEditor').val() === '' ||
			$('#contentEditor').val() === '')
			{
			$('#errorText').show();
		} else {
			// get both time values
			let publishDate = $('#publishDate').val();
			let expirationDate = $('#expirationDate').val();
			expirationDate = new Date(expirationDate);
			// check if publishDate is empty
			if (publishDate === "") {
				// if empty set to current time
				publishDate = new Date();
			} else {
				// if set, set time to 1 Minute after Midnight
				publishDate = new Date(publishDate);
				publishDate.setHours(0);
				publishDate.setMinutes(1);
			}
			// set expirationDate to 1 Minute before midnight
			expirationDate.setHours(23);
			expirationDate.setMinutes(59);
			// get title and text
			let title = $('#subjectEditor').val();
			let text = $('#contentEditor').val();
			// set dateCreated
			let dateCreated = new Date();
			// create new messageOfTheDay
			let newMessage = {
				subject: title,
				content: text,
				dateCreated: dateCreated,
				dateUpdated: dateCreated,
				locationType: message.get('locationType'),
				expirationDate: expirationDate,
				publishDate: publishDate
			};
			if (isEdit) {
				newMessage.id = message.get('id');
				Meteor.call('updateMessageOfTheDay', newMessage);
				message.clear();
				$('#motdAddAndEdit').modal('hide');
			} else {
				Meteor.call('insertMessageOfTheDay', newMessage);
				$('#motdAddAndEdit').modal('hide');
			}
		}
	},
	'click #toggleLoggedIn': function () {
		toggleActiveClass(0);
		message.set('locationType', 0);
	},
	'click #toggleLoggedOut': function () {
		toggleActiveClass(1);
		message.set('locationType', 1);
	},
	'click #toggleBothLocations': function () {
		toggleActiveClass(2);
		message.set('locationType', 2);
	},
	'click #previewButton': function () {
		message.set('subject', $('#subjectEditor').val());
		message.set('content', $('#contentEditor').val());
		$('#motdsPreviewModal').modal('show');
	}
});

Template.motdsPreviewModal.helpers({
	getTitle: function () {
		return message.get('subject');
	},
	getContent: function () {
		return message.get('content');
	}
});
