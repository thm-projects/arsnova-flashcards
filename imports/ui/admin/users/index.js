//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "../../../config/dompurify.js";
import {getAuthorName} from "../../../api/userdata";
import {Bonus} from "../../../api/bonus";
import "./index.html";
import "./user.js";

/*
 * ############################################################################
 * admin_users
 * ############################################################################
 */

Template.admin_users.helpers({
	userListAdmin: function () {
		var users = Meteor.users.find({_id: {$nin: ['NotificationsTestUser']}});
		var fields = [];
		var dateString = null;
		var date = null;

		users.forEach(function (user) {
			dateString = moment(user.createdAt).locale(Session.get('activeLanguage')).format('LL');
			date = moment(user.createdAt).format("YYYY-MM-DD");
			let notificationSystems = Bonus.getNotificationStatus(user);
			let gotMail = (user.email !== "" && user.email !== undefined && user._id !== Meteor.userId());
			fields.push({"_id": user._id, username: DOMPurify.sanitize(getAuthorName(user._id, true, false, true),DOMPurifyConfig), "loginid": DOMPurify.sanitize(user.profile.name, DOMPurifyConfig), "dateString": dateString, "date": date, "notificationSystems": notificationSystems, "gotMail": gotMail});
		});

		return fields;
	},
	tableSettings: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			useFontAwesome: false,
			fields: [
				{
					key: 'username', label: TAPi18n.__('admin.user.header'),
					fn: function (value) {
						return value;
					}
				},
				{
					key: 'loginid', label: TAPi18n.__('admin.user.username'),
					fn: function (value) {
						return value;
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.superAdmin'), cellClass: 'admin',
					fn: function (value, object) {
						if (Roles.userIsInRole(value, 'admin')) {
							return new Spacebars.SafeString("<span name='admin" + object.profilename + "'><i class='fa fa-check'></i></span>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.admin'), cellClass: 'editor',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'editor')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.lecturer'), cellClass: 'lecturer',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'lecturer')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.pro'), cellClass: 'pro',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'pro')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.university'), cellClass: 'university',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'university')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: 'notificationSystems', label: TAPi18n.__('confirmLearn-form.notification'),
					fn: function (value) {
						return new Spacebars.SafeString(value);
					}
				},
				{
					key: 'gotMail',
					label: TAPi18n.__('admin.mail'),
					cellClass: 'mailto',
					sortable: false,
					fn: function (value) {
						if (value) {
							return new Spacebars.SafeString("<a class='mailtoUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#messageModalAdmin'><span class='flex-content'><i class='fa fa-envelope'></i></span></a>");
						}
					}
				},
				{
					key: 'dateString', label: TAPi18n.__('admin.joined'),
					fn: function (value, object) {
						return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.blocked'), cellClass: 'blocked',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'blocked')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.edit'),
					cellClass: 'edit',
					sortable: false,
					fn: function (value) {
						return new Spacebars.SafeString("<a id='linkToAdminUser' class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "' data-userid='" + value + "'><span class='flex-content'><i class='fas fa-edit'></i></span></a>");
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.delete'),
					cellClass: 'delete',
					sortable: false,
					fn: function (value) {
							if ((Meteor.user()._id !== value) &&
								(!Roles.userIsInRole(value, 'admin')))
							{
								return new Spacebars.SafeString("<a class='deleteUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deleteuser') + "' data-toggle='modal' data-target='#userConfirmModalAdmin'><span class='flex-content'><i class='fas fa-ban'></i></span></a>");
							}
						}

				}
			]
		};
	}
});

Template.admin_users.events({
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var user = this;

		if (event.target.className === "deleteUserAdmin btn btn-xs btn-default" || event.target.className === "fas fa-ban") {
			Session.set('userId', user._id);
		}
		if (event.target.className === "mailtoUserAdmin btn btn-xs btn-default" || event.target.className === "fa fa-envelope") {
			Session.set('userId', user._id);
			Session.set('getUsername', user.profilename);
		}
	},
	'click #linkToAdminUser': function (event) {
		var userid = $(event.currentTarget).data("userid");
		Router.go('admin_user', {_id: userid});
	}
});

/*
 * ############################################################################
 * userConfirmFormAdmin
 * ############################################################################
 */

Template.userConfirmFormAdmin.events({
	'click #userDeleteAdmin': function () {
		var id = Session.get('userId');

		$('#userConfirmModalAdmin').on('hidden.bs.modal', function () {
			Meteor.call("deleteUserProfile", id);
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * messageFormAdmin
 * ############################################################################
 */

Template.messageFormAdmin.onRendered(function () {
	$('#messageModalAdmin').on('hidden.bs.modal', function () {
		$('#helpMessageTextAdmin').html('');
		$('#messageTextAdminLabel').css('color', '');
		$('#messageTextAdmin').css('border-color', '');
		$('#messageTextAdmin').val('');
		$('#messageReasonAdmin').val($('#messageReasonAdmin option:first').val());
		Session.set('showCardset', false);
	});
});

Template.messageFormAdmin.helpers({
	getUsername: function () {
		return (Session.get('getUsername'));
	},
	getCardsets: function () {
		var user_id = Session.get('userId');
		return Cardsets.find({owner: user_id}, {
			sort: {
				name: 1
			}
		});
	},
	isCardset: function () {
		var showCardset = Session.get('showCardset');

		return (showCardset);
	}
});

Template.messageFormAdmin.events({
	'click #messageTextSave': function () {
		var user_id = Session.get('userId');

		if ($('#messageTextAdmin').val().length < 50) {
			$('#messageTextAdminLabel').css('color', '#b94a48');
			$('#messageTextAdmin').css('border-color', '#b94a48');
			$('#helpMessageTextAdmin').html(TAPi18n.__('admin.message.text_chars'));
			$('#helpMessageTextAdmin').css('color', '#b94a48');
		} else {
			var text = $('#messageTextAdmin').val();
			var type;
			var link_id;

			if ($('#messageReasonAdmin').val() === "Beschwerde Benutzer" || $('#messageReasonAdmin').val() === "Complaint user" || $('#messageReasonAdmin').html() === 'Beschwerde Benutzer' || $('#messageReasonAdmin').html() === 'Complaint user') {
				type = "Adminbenachrichtigung (Beschwerde Benutzer)";
				link_id = user_id;
			} else {
				type = "Adminbenachrichtigung (Beschwerde Kartensatz)";
				var selectedCardset = $('#messageCardsetAdmin').children(":selected").attr("id");
				link_id = selectedCardset;
			}

			var target = user_id;

			Meteor.call("addNotification", target, type, text, link_id, target);
			Meteor.call("addNotification", 'admin', type, text, link_id, target);
			$('#messageModalAdmin').modal('hide');
		}
	},
	'keyup #messageTextAdmin': function () {
		$('#messageTextAdminLabel').css('color', '');
		$('#messageTextAdmin').css('border-color', '');
		$('#helpMessageTextAdmin').html('');
	},
	'change #messageReasonAdmin': function () {
		if ($('#messageReasonAdmin').val() === "Beschwerde Benutzer" || $('#messageReasonAdmin').val() === "Complaint user") {
			Session.set('showCardset', false);
		} else {
			Session.set('showCardset', true);
		}
	}
});
