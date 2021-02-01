//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/subscriptions/cardsets.js";
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "../../../config/dompurify.js";
import {getAuthorName} from "../../../util/userData";
import {Bonus} from "../../../util/bonus";
import "./index.html";
import "./user.js";
import {UserPermissions} from "../../../util/permissions";

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
			let mail;
			let name;
			let service;
			if (UserPermissions.isCardsLogin(user)) {
				if (user.username !== "" && user.username !== undefined) {
					name = user.username;
				}
				if (user.email !== "" && user.email !== undefined) {
					mail = user.email;
				}
				service = ".cards";
			} else {
				if (user.profile.name !== "" && user.profile.name !== undefined) {
					name = user.profile.name;
				}
				if (user.email !== "" && user.email !== undefined) {
					mail = user.email;
				}
				let services = _.keys(user.services)[0];
				service = services.charAt(0).toUpperCase() + services.slice(1);
			}
			fields.push({"_id": user._id, username: DOMPurify.sanitize(getAuthorName(user._id, true, false, true),DOMPurifyConfig), "loginid": DOMPurify.sanitize(name, DOMPurifyConfig), "dateString": dateString, "date": date, "notificationSystems": notificationSystems, "mail": mail, "service": service});
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
					key: 'loginid', label: TAPi18n.__('admin.user-index.loginid'),
					fn: function (value) {
						return value;
					}
				},
				{
					key: 'service', label: TAPi18n.__('admin.user-index.service'),
					fn: function (value) {
						return value;
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.superAdmin'), cellClass: 'admin',
					fn: function (value, object) {
						if (Roles.userIsInRole(value, 'admin')) {
							return new Spacebars.SafeString("<span name='admin" + object.profilename + "'><span class='fas fa-check'></span></span>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.admin'), cellClass: 'editor',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'editor')) {
							return new Spacebars.SafeString("<span class='fas fa-check'></span>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.lecturer'), cellClass: 'lecturer',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'lecturer')) {
							return new Spacebars.SafeString("<span class='fas fa-check'></span>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.pro'), cellClass: 'pro',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'pro')) {
							return new Spacebars.SafeString("<span class='fas fa-check'></span>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.university'), cellClass: 'university',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'university')) {
							return new Spacebars.SafeString("<span class='fas fa-check'></span>");
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
					key: 'mail',
					label: TAPi18n.__('admin.mail'),
					cellClass: 'mailto',
					sortable: false,
					fn: function (value) {
						if (value) {
							return new Spacebars.SafeString("<a rel='noopener noreferrer'   class='mailtoUserAdmin' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#messageModalAdmin'>" + value + "</a>");
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
							return new Spacebars.SafeString("<span class='fas fa-check'></span>");
						}
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.edit'),
					cellClass: 'edit',
					sortable: false,
					fn: function (value) {
						return new Spacebars.SafeString("<a rel='noopener noreferrer'   id='linkToAdminUser' class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "' data-userid='" + value + "'><span class='flex-content'><span class='fas fa-edit'></span></span></a>");
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
								return new Spacebars.SafeString("<a rel='noopener noreferrer'   class='deleteUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deleteuser') + "' data-toggle='modal' data-target='#userConfirmModalAdmin'><span class='flex-content'><span class='fas fa-ban'></span></span></a>");
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
		if (event.target.className === "mailtoUserAdmin btn btn-xs btn-default" || event.target.className === "fas fa-envelope") {
			Session.set('userId', user._id);
			Session.set('getUsername', user.profilename);
		}
	},
	'click #linkToAdminUser': function (event) {
		var userid = $(event.currentTarget).data("userid");
		FlowRouter.go('admin_user', {_id: userid});
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
