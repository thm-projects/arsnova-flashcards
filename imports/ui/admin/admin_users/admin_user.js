//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Cardsets} from '../../../api/cardsets.js';

import './admin_user.html';

/**
 * ############################################################################
 * admin_user
 * ############################################################################
 */

Template.admin_user.helpers({
	getService: function () {
		var userId = Router.current().params._id;
		if (userId !== undefined) {
			var user = Meteor.users.findOne(userId);
			if (user !== undefined && user.services !== undefined) {
				var service = _.keys(user.services)[0];
				service     = service.charAt(0).toUpperCase() + service.slice(1);
				return service;
			}
		}
		return null;
	},
	getDateUser: function () {
		return moment(this.createdAt).locale(getUserLanguage()).format('LL');
	},
	getLvl: function () {
		if (this.lvl === undefined) {
			return 0;
		} else {
			return this.lvl;
		}
	},
	getOnlineStatus: function (status) {
		if (status === true) {
			return "Online";
		} else {
			return "Offline";
		}
	},
	getLastLogin: function (lastLogin) {
		if (lastLogin) {
			return moment(this.status.lastLogin.date).locale(getUserLanguage()).format('LLL');
		} else {
			return null;
		}
	},
	cardsetListUserAdmin: function () {
		var cardsets   = Cardsets.find({owner: this._id});
		var fields     = [];
		var dateString = null;
		var date       = null;
		var kind       = null;

		cardsets.forEach(function (cardset) {
			dateString = moment(cardset.date).locale(getUserLanguage()).format('LL');
			date       = moment(cardset.date).format("YYYY-MM-DD");
			if (cardset.kind === 'personal') {
				kind = 'Private';
			} else if (cardset.kind === 'free') {
				kind = 'Free';
			} else if (cardset.kind === 'edu') {
				kind = 'Edu';
			} else if (cardset.kind === 'pro') {
				kind = 'Pro';
			}

			fields.push({
				"_id": cardset._id,
				"name": cardset.name,
				"kind": kind,
				"dateString": dateString,
				"date": date
			});
		});

		return fields;
	},
	tableSettings: function () {
		return {
			showNavigationRowsPerPage: false,
			fields: [
				{key: 'name', label: TAPi18n.__('admin.name')},
				{key: 'kind', label: TAPi18n.__('admin.kind')},
				{
					key: 'dateString', label: TAPi18n.__('admin.created'), fn: function (value, object) {
					return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
				}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.edit'),
					sortable: false,
					cellClass: 'edit',
					fn: function (value) {
						return new Spacebars.SafeString("<a id='linkToAdminUserCardset' class='editCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcardset') + "' data-cardsetid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
					}
				},
				{
					key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function () {
					return new Spacebars.SafeString("<a class='deleteCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecardset') + "' data-toggle='modal' data-target='#cardsetConfirmModalUserAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
				}
				}
			]
		};
	},
	'isVisible': function (id) {
		if (Meteor.users.findOne(id)) {
			return Meteor.users.findOne(id).visible;
		} else {
			return null;
		}
	},
	proUser: function (value) {
		return Roles.userIsInRole(this._id, 'pro') === value;
	},
	eduUser: function (value) {
		return Roles.userIsInRole(this._id, 'university') === value;
	},
	lecturerUser: function (value) {
		return Roles.userIsInRole(this._id, 'lecturer') === value;
	},
	blockedUser: function (value) {
		Session.set('userBlocked', Roles.userIsInRole(this._id, 'blocked'));
		return Roles.userIsInRole(this._id, 'blocked') === value;
	},
	editorUser: function (value) {
		return Roles.userIsInRole(this._id, 'editor') === value;
	},
	isAdminUser: function (id) {
		if (id) {
			var currentUser = Meteor.user()._id;

			if (Roles.userIsInRole(id, 'admin')) {
				if (Roles.userIsInRole(currentUser, 'editor')) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			return null;
		}
	},
	isCurrentUser: function (id) {
		if (id) {
			var currentUser = Meteor.user()._id;

			if (id === currentUser) {
				return false;
			} else {
				return true;
			}
		} else {
			return null;
		}
	},
	isUserBlocked: function () {
		return Session.get('userBlocked');
	}
});

Template.admin_user.events({
	'click #userSaveAdmin': function (event, tmpl) {
		var name    = $('#editUserNameAdmin').val();
		var user_id = this._id;

		Meteor.call("checkUsersName", name, user_id, function (error, result) {
			if (error) {
				$('#editUserNameLabelAdmin').css('color', '#b94a48');
				$('#editUserNameAdmin').css('border-color', '#b94a48');
				$('#helpEditUserNameAdmin').html(TAPi18n.__('admin.user.name_exists'));
				$('#helpEditUserNameAdmin').css('color', '#b94a48');
			}
			if (result) {
				var re          = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				var email       = $('#editUserEmailAdmin').val();
				var blockedtext = $('#editUserBlockedtextAdmin').val();
				var check       = re.test(email);
				var visible     = null;
				var pro         = ('true' === tmpl.find('#editUserProAdmin > .active > input').value);
				var lecturer    = ('true' === tmpl.find('#editUserLecturerAdmin > .active > input').value);

				if ($('#profilepublicoption1Admin').hasClass('active')) {
					visible = true;
				} else if ($('#profilepublicoption2Admin').hasClass('active')) {
					visible = false;
				}

				if (check === false && email !== "") {
					$('#editUserEmailLabelAdmin').css('color', '#b94a48');
					$('#editUserEmailAdmin').css('border-color', '#b94a48');
					$('#helpEditUserEmailAdmin').html(TAPi18n.__('admin.user.email_invalid'));
					$('#helpEditUserEmailAdmin').css('color', '#b94a48');
				}
				if (result.length < 5 || result.length > 25) {
					if (result.length < 5) {
						$('#helpEditUserNameAdmin').html(TAPi18n.__('admin.user.name_toShort'));
					} else if (result.length > 25) {
						$('#helpEditUserNameAdmin').html(TAPi18n.__('admin.user.name_toLong'));
					}
					$('#editUserNameLabelAdmin').css('color', '#b94a48');
					$('#editUserNameAdmin').css('border-color', '#b94a48');
					$('#helpEditUserNameAdmin').css('color', '#b94a48');
				}
				if (pro && !visible || lecturer && !visible) {
					$('#editUserVisibleLabelAdmin').css('color', '#b94a48');
					$('#helpEditUserVisibleAdmin').html(TAPi18n.__('admin.user.visible_invalid'));
					$('#helpEditUserVisibleAdmin').css('color', '#b94a48');
				}
				if (Session.get('userBlocked')) {
					if (blockedtext === "" && 'true' === tmpl.find('#editUserBlockedAdmin > .active > input').value) {
						$('#editUserBlockedtextLabelAdmin').css('color', '#b94a48');
						$('#editUserBlockedtextAdmin').css('border-color', '#b94a48');
						$('#helpEditUserBlockedtextAdmin').html(TAPi18n.__('admin.user.blockedtext_invalid'));
						$('#helpEditUserBlockedtextAdmin').css('color', '#b94a48');
					}
				}
				if ((Session.get('userBlocked') && $('#editUserBlockedtextAdmin').val() !== "" || !Session.get('userBlocked')) && (check === true || email === "") && (result.length >= 5) && (result.length <= 25) && !error && (pro && visible || !pro) && (lecturer && visible || !lecturer)) {
					if ('true' === tmpl.find('#editUserProAdmin > .active > input').value) {
						Meteor.call('updateRoles', user_id, 'pro');
					} else {
						Meteor.call('updateRoles', user_id, 'standard');
					}
					if ('true' === tmpl.find('#editUserEduAdmin > .active > input').value) {
						Meteor.call('updateRoles', user_id, 'university');
					} else {
						Meteor.call('removeRoles', user_id, 'university');
					}
					if ('true' === tmpl.find('#editUserLecturerAdmin > .active > input').value) {
						Meteor.call('updateRoles', user_id, 'lecturer');
					} else {
						Meteor.call('removeRoles', user_id, 'lecturer');
					}

					if ($('#editUserBlockedAdmin').length) {
						if ('true' === tmpl.find('#editUserBlockedAdmin > .active > input').value) {
							Meteor.call('updateRoles', user_id, 'blocked');
						} else {
							Meteor.call('removeRoles', user_id, 'blocked');
						}
					}
					if ($('#editUserEditorAdmin').length) {
						if ('true' === tmpl.find('#editUserEditorAdmin > .active > input').value) {
							Meteor.call('updateRoles', user_id, 'editor');
						} else {
							Meteor.call('removeRoles', user_id, 'editor');
						}
					}

					Meteor.call('updateUser', user_id, visible, email, blockedtext);
					Meteor.call("updateUsersName", result, user_id);
					window.history.go(-1);
				}
			}
		});
	},
	'click #userCancelAdmin': function () {
		window.history.go(-1);
	},
	'click #userDeleteAdmin': function () {
		$("#userDeleteAdmin").css('display', "none");
		$("#userConfirmAdmin").css('display', "");
	},
	'click #userConfirmAdmin': function () {
		var id = this._id;
		Meteor.call("deleteUser", id);
		window.history.go(-1);
	},
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var cardset = this;

		if (event.target.className == "deleteCardsetAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
			Session.set('cardsetId', cardset._id);
		}
	},
	'click #linkToAdminUserCardset': function (event) {
		var cardsetid = $(event.currentTarget).data("cardsetid");
		Router.go('admin_cardset', {_id: cardsetid});
	},
	'keyup #editUserEmailAdmin': function () {
		$('#editUserEmailLabelAdmin').css('color', '');
		$('#editUserEmailAdmin').css('border-color', '');
		$('#helpEditUserEmailAdmin').html('');
	},
	'keyup #editUserNameAdmin': function () {
		$('#editUserNameLabelAdmin').css('color', '');
		$('#editUserNameAdmin').css('border-color', '');
		$('#helpEditUserNameAdmin').html('');
	},
	'change #editUserVisibleAdmin': function () {
		$('#editUserVisibleLabelAdmin').css('color', '');
		$('#helpEditUserVisibleAdmin').html('');
	},
	'change #editUserBlockedAdmin': function () {
		Session.set('userBlocked', $('#editUserBlockedAdmin input[name=blockedUser]:checked').val() === 'true');
	}
});

/**
 * ############################################################################
 * cardsetConfirmFormUserAdmin
 * ############################################################################
 */

Template.cardsetConfirmFormUserAdmin.events({
	'click #cardsetDeleteUserAdmin': function () {
		var id = Session.get('cardsetId');

		$('#cardsetConfirmModalUserAdmin').on('hidden.bs.modal', function () {
			Meteor.call("deleteCardset", id);
		}).modal('hide');
	}
});
