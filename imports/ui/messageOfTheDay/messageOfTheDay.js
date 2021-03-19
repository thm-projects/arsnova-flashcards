import "./messageOfTheDayModal.html";
import {MessageOfTheDay} from "../../api/subscriptions/messageOfTheDay";
import {ReactiveDict} from "meteor/reactive-dict";

let tempMessages = [];

Template.messageOfTheDayModal.onDestroyed(function () {
	$(".modal-backdrop").remove();
});
// filters out all motd entry in messages with the same id from ids
function filterOut(messages, ids) {
	let flag = true;
	let tmp = [];
	messages.forEach(message => {
		ids.forEach(id => {
			if (message._id === id) {
				flag = false;
			}
		});
		if (flag) {
			tmp.push(message);
		} else {
			flag = true;
		}
	});
	return tmp;
}

// return current users motds ids or empty array
function usersMotds() {
	let user = Meteor.userId();
	let getUser = Meteor.users.findOne({
		"_id": user
	});
	if (getUser !== undefined) {
		if (getUser.hasOwnProperty('motds')) {
			return getUser.motds;
		}
	}
	return [];
}

export let checkForNewMessages = function () {
	// get all messages that are already published and not expired
	let messages = MessageOfTheDay.find({$and: [
			{expirationDate: {$gte: new Date()}},
			{publishDate: {$lte: new Date()}}
		]}).fetch();
	if (Meteor.userId()) {
		// get current user motds
		let motds = usersMotds();
		// filter out already seen messages
		messages = filterOut(messages, motds);
		const localMessages = JSON.parse(localStorage.getItem('motd') || '[]');
		messages = filterOut(messages, localMessages);
		return messages.length > 0;
	} else {
		// remove all messages the user has already set in the local storage
		const localMessages = JSON.parse(localStorage.getItem('motd') || '[]');
		messages = filterOut(messages, localMessages);
		return messages.length > 0;
	}
};

Template.messageOfTheDayModal.helpers({
	getMessages: function () {
		if (Meteor.userId()) {
			// get all messages that are already published and not expired and for logged in users
			tempMessages = MessageOfTheDay.find({$and: [
					{expirationDate: {$gte: new Date()}},
					{publishDate: {$lte: new Date()}}
				]}).fetch();
			// get current users motds
			let motds = usersMotds();
			// if they are empty return messages unfiltered
			if (motds === undefined) {
				tempMessages = [];
			} else {
				// filter out already seen messages
				tempMessages = filterOut(tempMessages, motds);
				// get local entry for motds or empty array
				const localMessages = JSON.parse(localStorage.getItem('motd') || '[]');
				tempMessages = filterOut(tempMessages, localMessages);
			}
		} else {
			// get all messages that are already published and not expired and for the landing page
			tempMessages = MessageOfTheDay.find({$and: [
					{expirationDate: {$gte: new Date()}},
					{publishDate: {$lte: new Date()}}
				]}).fetch();
			// get local entry for motds or empty array
			const localMessages = JSON.parse(localStorage.getItem('motd') || '[]');
			tempMessages = filterOut(tempMessages, localMessages);
		}
		return tempMessages;
	}
});

Template.messageOfTheDayModal.events({
	'click #acceptButton': function () {
		if (Meteor.userId()) {
			// get users motds
			let userMotds = usersMotds();
			userMotds.push(this._id);
			// updates user entry
			Meteor.call('updateMotd', userMotds, Meteor.userId());
		}
		//get his saved messages of the day or empty array
		let motds = JSON.parse(localStorage.getItem('motd') || '[]');
		//push new motds _id
		motds.push(this._id);
		//safe array with new id again
		localStorage.setItem('motd', JSON.stringify(motds));
		// filter out all double entries
		let tmp = [];
		let tmpCounter = 0;
		for (let i = 0; i < tempMessages.length; i++) {
			if (tempMessages[i]._id !== this._id) {
				tmp[tmpCounter] = tempMessages[i];
				tmpCounter++;
			}
		}
		tempMessages = tmp;
		// removes message from the dom
		document.getElementById(this._id).remove();
		// close modal after last element
		if (tempMessages.length === 0) {
			document.getElementById('messageOfTheDayModal').remove();
			$(".modal-backdrop").remove();
		}
	}
});

// Preview Modal //////////////////

let messageReactive = new ReactiveDict();

export let openMessage = function (message) {
	messageReactive.set('subject', message.subject);
	messageReactive.set('content', message.content);
	messageReactive.set('_id', message._id);
	$('#messagePreviewModal').modal('show');
};

Template.messagePreviewModal.helpers({
	getSubject: function () {
		return messageReactive.get('subject');
	},
	getContent: function () {
		return messageReactive.get('content');
	}
});

Template.messagePreviewModal.events({
	'click #previewAccept': function () {
		if (Meteor.userId()) {
			// get users motds
			let userMotds = usersMotds();
			if (!(userMotds.includes(messageReactive.get('_id')))) {
				userMotds.push(messageReactive.get('_id'));
				// updates user entry
				Meteor.call('updateMotd', userMotds, Meteor.userId());
			}
		}
		//get his saved messages of the day or empty array
		let motds = JSON.parse(localStorage.getItem('motd') || '[]');
		if (!(motds.includes(messageReactive.get('_id')))) {
			//push new motds _id
			motds.push(this._id);
			//safe array with new id again
			localStorage.setItem('motd', JSON.stringify(motds));
		}
		$('#messagePreviewModal').modal('hide');
	}
});
