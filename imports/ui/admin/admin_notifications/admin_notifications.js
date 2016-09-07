//------------------------ IMPORTS

import {Meteor } from 'meteor/meteor';
import {Template } from 'meteor/templating';
import {Session } from 'meteor/session';

import {Cardsets } from '../../../api/cardsets.js';
import {Notifications } from '../../../api/notifications.js';

import './admin_notifications.html';

/**
* ############################################################################
* function getTypeAdmin
* ############################################################################
*/
function getTypeAdmin(type) {
	if (type === 'Gemeldeter Benutzer') {
		type = TAPi18n.__('notifications.reporteduser');
	} else if (type === 'Gemeldeter Kartensatz') {
		type = TAPi18n.__('notifications.reportedcardset');
	} else if (type === 'Adminbenachrichtigung (Beschwerde Benutzer)') {
		type = TAPi18n.__('notifications.reporteduseradmin');
	} else if (type === 'Adminbenachrichtigung (Beschwerde Kartensatz)') {
		type = TAPi18n.__('notifications.reportedcardsetadmin');
	} else if (type === 'Dozenten-Anfrage') {
		type = TAPi18n.__('notifications.lecturer');
	}

	return type;
}

/**
* ############################################################################
* admin_notifications
* ############################################################################
*/

Template.admin_notifications.helpers({
	getNotifications: function () {
		return Notifications.find({target_type: 'admin', target: Meteor.userId()});
	},
	complaintMessagesListAdmin: function () {
		var notifications = Notifications.find({target_type: 'admin', target: Meteor.userId(), type: {$in: ["Gemeldeter Benutzer", "Gemeldeter Kartensatz"]}});
		var fields = [];
		var dateString = null;
		var date = null;
		var sender = null;
		var complaint = null;
		var complaint_id = null;
		var receiver = null;
		var receiver_id = null;
		var cardset = null;
		var user = null;

		notifications.forEach(function (notification) {
			dateString = moment(notification.date).locale(getUserLanguage()).format('LLLL');
			date = moment(notification.date).format("YYYY-MM-DD-h-mm");

			sender = Meteor.users.findOne({_id: notification.origin});

			if (sender !== undefined) {sender = sender.profile.name;}

			cardset = Cardsets.findOne({_id: notification.link_id});
			user = Meteor.users.findOne({_id: notification.link_id});

			if (cardset !== undefined) {
				complaint_id = cardset._id;
				complaint = cardset.name;
				receiver_id = cardset.owner;
				receiver = cardset.username;
			} else if (user !== undefined) {
				complaint_id = user._id;
				complaint = user.profile.name;
				receiver_id = user._id;
				receiver = user.profile.name;
			}
			fields.push({"_id": notification._id, "type": notification.type, "sender_id": notification.origin, "sender": sender, "complaint_id": complaint_id, "complaint": complaint, "text": notification.text, "dateString": dateString, "date": date, "receiver_id": receiver_id, "receiver": receiver});

			complaint = null;
			receiver_id = null;
		});

		return fields;
	},
	tableSettingsComplaint: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			fields: [
				{key: 'type', label: TAPi18n.__('admin.type'), fn: function (value) {
					return getTypeAdmin(value);
				}},
				{key: 'sender', label: TAPi18n.__('admin.sender'), fn: function (value, object) {
					if (value === null) {
						return TAPi18n.__('admin.deletedUser');
					} else {
						return new Spacebars.SafeString("<span name='" + value + "'><a class='getpointer' id='linkToSenderComplaint' data-senderid='" + object.sender_id + "'>" + value + "</a></span>");
					}
				}},
				{key: 'complaint', label: TAPi18n.__('admin.reason'), fn: function (value, object) {
					if (value === null) {
						return TAPi18n.__('admin.deletedUser');
					} else {
						return new Spacebars.SafeString("<span name='" + value + "'><a class='getpointer' id='linkToComplaintComplaint' data-complaintid='" + object.complaint_id + "'>" + value + "</a></span>");
					}
				}},
				{key: 'text', label: TAPi18n.__('admin.text'), sortable: false},
				{key: 'dateString', label: TAPi18n.__('admin.date'), fn: function (value, object) {
					return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
				}},
				{key: 'receiver_id', label: TAPi18n.__('admin.replyreceiver'), cellClass: 'mailtoReceiver', sortable: false, fn: function (value) {
					var user = Meteor.users.findOne({_id: value});

					if (user === undefined) {
						return TAPi18n.__('admin.optionNotPossible');
					} else if (Meteor.user()._id !== value) {
						return new Spacebars.SafeString("<a class='mailToReceiverAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#messageModalNotificationAdmin'><i class='receiver-fa fa fa-envelope'></i></a>");
					}
				}},
				{key: 'sender_id', label: TAPi18n.__('admin.replyrsender'), cellClass: 'mailtoSender', sortable: false, fn: function (value, object) {
					if (object.sender === undefined) {
						return TAPi18n.__('admin.optionNotPossible');
					} else if (Meteor.user()._id !== value) {
						return new Spacebars.SafeString("<a class='mailToSenderAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#messageModalNotificationAdmin'><i class='sender-fa fa fa-envelope'></i></a>");
					}
				}},
				{key: '_id', label: TAPi18n.__('admin.delete'), cellClass: 'delete', sortable: false, fn: function () {
					return new Spacebars.SafeString("<a class='deleteNotificationAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletenotification') + "' data-toggle='modal' data-target='#notificationConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
				}}
			]
		};
	},
	lecturerMessagesListAdmin: function () {
		var notifications = Notifications.find({target_type: 'admin', target: Meteor.userId(), type: 'Dozenten-Anfrage'});
		var fields = [];
		var dateString = null;
		var date = null;
		var sender = null;
		var request = null;

		notifications.forEach(function (notification) {
			dateString = moment(notification.date).locale(getUserLanguage()).format('LLLL');
			date = moment(notification.date).format("YYYY-MM-DD-h-mm");

			sender = Meteor.users.findOne({_id: notification.origin});

			if (sender !== undefined) {
				request = sender.request;
				sender = sender.profile.name;
			}

			fields.push({"_id": notification._id, "type": notification.type, "sender_id": notification.origin, "sender": sender, "text": notification.text, "request": request, "dateString": dateString, "date": date});
		});

		return fields;
	},
	tableSettingsLecturer: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			fields: [
				{key: 'type', label: TAPi18n.__('admin.type'), fn: function (value) {
					return getTypeAdmin(value);
				}},
				{key: 'sender', label: TAPi18n.__('admin.sender'), fn: function (value, object) {
					if (value === null) {
						return TAPi18n.__('admin.deletedUser');
					} else {
						return new Spacebars.SafeString("<span name='" + value + "'><a class='getpointer' id='linkToSenderLecturer' data-senderidLecturer='" + object.sender_id + "'>" + value + "</a></span>");
					}
				}},
				{key: 'text', label: TAPi18n.__('admin.text'), sortable: false},
				{key: 'sender_id', label: TAPi18n.__('admin.request'), cellClass: 'mailtoLecturer', sortable: false, fn: function (value, object) {
					if (object.sender === undefined) {
						return TAPi18n.__('admin.optionNotPossible');
					}	else if (Meteor.user()._id !== value) {
						return new Spacebars.SafeString("<a class='mailToLecturerAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#notificationLecturerModalAdmin'><i class='fa fa-university'></i></a>");
					}
				}},
				{key: 'dateString', label: TAPi18n.__('admin.date'), fn: function (value, object) {
					return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
				}},
				{key: '_id', label: TAPi18n.__('admin.delete'), cellClass: 'delete', sortable: false, fn: function () {
					return new Spacebars.SafeString("<a class='deleteNotificationAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletenotification') + "' data-toggle='modal' data-target='#notificationConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
				}}
			]
		};
	},
	sendMessagesListAdmin: function () {
		var notifications = Notifications.find({target_type: 'admin', target: Meteor.userId(), type: {$in: ["Adminbenachrichtigung (Beschwerde Benutzer)", "Adminbenachrichtigung (Beschwerde Kartensatz)"]}});
		var fields = [];
		var dateString = null;
		var date = null;
		var sender = null;
		var complaint = null;
		var complaint_id = null;
		var receiver = null;
		var receiver_id = null;
		var cardset = null;
		var user = null;

		notifications.forEach(function (notification) {
			dateString = moment(notification.date).locale(getUserLanguage()).format('LLLL');
			date = moment(notification.date).format("YYYY-MM-DD-h-mm");

			sender = Meteor.users.findOne({_id: notification.origin});
			receiver = Meteor.users.findOne({_id: notification.receiver});

			if (sender !== undefined) {sender = sender.profile.name; }
			if (receiver !== undefined) {
				receiver_id = receiver._id;
				receiver = receiver.profile.name;
			}

			cardset = Cardsets.findOne({_id: notification.link_id});
			user = Meteor.users.findOne({_id: notification.link_id});

			if (cardset !== undefined) {
				complaint_id = cardset._id;
				complaint = cardset.name;
			} else if (user !== undefined) {
				complaint_id = user._id;
				complaint = user.profile.name;
			}

			fields.push({"_id": notification._id, "type": notification.type, "sender_id": notification.origin, "sender": sender, "complaint_id": complaint_id, "complaint": complaint, "text": notification.text, "dateString": dateString, "date": date, "receiver_id": receiver_id, "receiver": receiver});

			complaint = null;
			receiver_id = null;
		});

		return fields;
	},
	tableSettingsSend: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			fields: [
				{key: 'type', label: TAPi18n.__('admin.type'), fn: function (value) {
					return getTypeAdmin(value);
				}},
				{key: 'sender', label: TAPi18n.__('admin.sender'), fn: function (value, object) {
					if (value === null) {
						return TAPi18n.__('admin.deletedUser');
					} else {
						return new Spacebars.SafeString("<span name='" + value + "'><a class='getpointer' id='linkToSenderSend' data-senderidsend='" + object.sender_id + "'>" + value + "</a></span>");
					}
				}},
				{key: 'complaint', label: TAPi18n.__('admin.reason'), fn: function (value, object) {
					if (value === null) {
						return TAPi18n.__('admin.deletedUser');
					} else {
						return new Spacebars.SafeString("<span name='" + value + "'><a class='getpointer' id='linkToComplaintSend' data-complaintidsend='" + object.complaint_id + "'>" + value + "</a></span>");
					}
				}},
				{key: 'text', label: TAPi18n.__('admin.text'), sortable: false},
				{key: 'receiver', label: TAPi18n.__('admin.receiver'), fn: function (value, object) {
					var user = Meteor.users.findOne({_id: object.receiver_id});

					if (user === undefined) {
						return TAPi18n.__('admin.deletedUser');
					} else {
						return new Spacebars.SafeString("<span name='" + value + "'><a class='getpointer' id='linkToReceiverSend' data-receiveridsend='" + object.receiver_id + "'>" + value + "</a></span>");
					}
				}},
				{key: 'dateString', label: TAPi18n.__('admin.date'), fn: function (value, object) {
					return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
				}},
				{key: '_id', label: TAPi18n.__('admin.delete'), cellClass: 'delete', sortable: false, fn: function () {
					return new Spacebars.SafeString("<a class='deleteNotificationAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletenotification') + "' data-toggle='modal' data-target='#notificationConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
				}}
			]
		};
	}
});

Template.admin_notifications.events({
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var notification = this;
		var id = notification.complaint_id;
		var receiver = notification.receiver;
		var sender = notification.sender;
		var cardset = Cardsets.findOne({_id: id});
		var user = Meteor.users.findOne({_id: id});

		if (event.target.className == "deleteCardsetAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
			Session.set('notificationId', notification._id);
		}
		if (event.target.className == "mailToReceiverAdmin btn btn-xs btn-default" ||
		event.target.className == "receiver-fa fa fa-envelope" ||
		event.target.className == "mailToSenderAdmin btn btn-xs btn-default" ||
		event.target.className == "sender-fa fa fa-envelope") {
			if (cardset !== undefined) {
				Session.set('isCardset', true);
				Session.set('getCardset', cardset);
			}	else if (user !== undefined) {
				Session.set('isCardset', false);
			}

			if (event.target.className == "mailToReceiverAdmin btn btn-xs btn-default" ||
			event.target.className == "receiver-fa fa fa-envelope") {
				Session.set('getUsername', receiver);
				Session.set('targetId', notification.receiver_id);
				Session.set('isReceiver', true);
			}	else {
				Session.set('getUsername', sender);
				Session.set('targetId', notification.sender_id);
				Session.set('receiverId', notification.receiver_id);
				Session.set('isReceiver', false);
			}
		}
		if (event.target.className == 'mailToLecturerAdmin btn btn-xs btn-default' || event.target.className == "fa fa-university") {
			Session.set('lecturerrequest', notification.request);
			Session.set('request_id', notification.sender_id);
			Session.set('requesttext', notification.text);
		}
	},
	'click #linkToSenderComplaint': function (event) {
		var sender_id = $(event.currentTarget).data("senderid");
		Router.go('admin_user', {_id: sender_id});
	},
	'click #linkToComplaintComplaint': function (event) {
		var complaint_id = $(event.currentTarget).data("complaintid");
		var cardset = Cardsets.findOne({_id: complaint_id});
		var user = Meteor.users.findOne({_id: complaint_id});

		if (cardset !== undefined) {
			Router.go('admin_cardset', {_id: complaint_id});
		} else if (user !== undefined) {
			Router.go('admin_user', {_id: complaint_id});
		}
	},
	'click #linkToSenderSend': function (event) {
		var sender_id = $(event.currentTarget).data("senderidsend");
		Router.go('admin_user', {_id: sender_id});
	},
	'click #linkToComplaintSend': function (event) {
		var complaint_id = $(event.currentTarget).data("complaintidsend");
		var cardset = Cardsets.findOne({_id: complaint_id});
		var user = Meteor.users.findOne({_id: complaint_id});

		if (cardset !== undefined) {
			Router.go('admin_cardset', {_id: complaint_id});
		} else if (user !== undefined) {
			Router.go('admin_user', {_id: complaint_id});
		}
	},
	'click #linkToReceiverSend': function (event) {
		var receiver_id = $(event.currentTarget).data("receiveridsend");
		Router.go('admin_user', {_id: receiver_id});
	},
	'click #linkToSenderLecturer': function (event) {
		var sender_id = $(event.currentTarget).data("senderidlecturer");
		Router.go('admin_user', {_id: sender_id});
	}
});

/**
* ############################################################################
* notificationConfirmFormAdmin
* ############################################################################
*/

Template.notificationConfirmFormAdmin.events({
	'click #notificationDeleteAdmin': function () {
		var id = Session.get('notificationId');

		$('#notificationConfirmModalAdmin').on('hidden.bs.modal', function () {
			Meteor.call("deleteNotification", id);
		}).modal('hide');
	}
});

/**
* ############################################################################
* messageFormNotificationAdmin
* ############################################################################
*/

Template.messageFormNotificationAdmin.onRendered(function () {
	$('#messageModalNotificationAdmin').on('hidden.bs.modal', function () {
		$('#helpMessageNotificationTextAdmin').html('');
		$('#messageNotificationTextLabelAdmin').css('color', '');
		$('#messageNotificationTextAdmin').css('border-color', '');
		$('#messageNotificationTextAdmin').val('');
	});
});

Template.messageFormNotificationAdmin.helpers({
	isCardset: function () {
		var isCardset = Session.get('isCardset');

		if (isCardset) {
			return true;
		} else {
			return false;
		}
	},
	getCardset: function () {
		var cardset = Session.get('getCardset');
		return cardset.name;
	},
	getUsername: function () {
		var username = Session.get('getUsername');
		return username;
	}
});

Template.messageFormNotificationAdmin.events({
	'click #messageNotificationSave': function () {
		var user_id = Session.get('targetId');
		var isReceiver = Session.get('isReceiver');

		if ($('#messageNotificationTextAdmin').val().length < 50) {
			$('#messageNotificationTextLabelAdmin').css('color', '#b94a48');
			$('#messageNotificationTextAdmin').css('border-color', '#b94a48');
			$('#helpMessageNotificationTextAdmin').html(TAPi18n.__('admin.message.text_chars'));
			$('#helpMessageNotificationTextAdmin').css('color', '#b94a48');
		} else {
			var text = $('#messageNotificationTextAdmin').val();
			var type;
			var link_id;

			if ($('#messageNotificationReasonAdmin').html() === "Beschwerde Benutzer" || $('#messageNotificationReasonAdmin').html() === "Complaint user") {
				type = "Adminbenachrichtigung (Beschwerde Benutzer)";
				if (isReceiver) {
					link_id = user_id;
				} else {
					link_id = Session.get('receiverId');
				}
			} else {
				type = "Adminbenachrichtigung (Beschwerde Kartensatz)";
				var cardsetname = $('#messageNotificationCardsetAdmin').text();
				var cardset = Cardsets.findOne({name: cardsetname});
				link_id = cardset._id;
			}

			var target = user_id;

			Meteor.call("addNotification", target, type, text, link_id, target);
			Meteor.call("addNotification", 'admin', type, text, link_id, target);
			$('#messageModalNotificationAdmin').modal('hide');
		}
	}
});

/**
* ############################################################################
* notificationLecturerFormAdmin
* ############################################################################
*/

Template.notificationLecturerFormAdmin.helpers({
	isRequest: function () {
		var isRequest = Session.get('lecturerrequest');
		var user_id = Session.get('request_id');

		if (!isRequest && Roles.userIsInRole(user_id, 'lecturer') || !isRequest) {
			return false;
		} else {
			return true;
		}
	},
	getRequesttext: function () {
		var text = Session.get('requesttext');
		return text;
	}
});

Template.notificationLecturerFormAdmin.events({
	'click #lecturerrequestNoAdmin': function () {
		var user_id = Session.get('request_id');
		$('#notificationLecturerModalAdmin').on('hidden.bs.modal', function () {
			Meteor.call("setLecturerRequest", user_id, false);
		}).modal('hide');
	},
	'click #lecturerrequestYesAdmin': function () {
		var user_id = Session.get('request_id');

		$('#notificationLecturerModalAdmin').on('hidden.bs.modal', function () {
			Meteor.call('setUserAsLecturer', user_id);
		}).modal('hide');
	}
});

/**
* ############################################################################
* allNotificationsConfirmFormAdmin
* ############################################################################
*/

Template.allNotificationsConfirmFormAdmin.events({
	'click #allNotificationsDeleteAdmin': function () {
		$('#allNotificationsConfirmModalAdmin').on('hidden.bs.modal', function () {
			var notifications = Notifications.find({target_type: 'admin', target: Meteor.userId()});
			notifications.forEach(function (notification) {
				Meteor.call("deleteNotification", notification);
			});
		}).modal('hide');
	}
});
