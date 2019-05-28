//------------------------IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import "./user.html";


/*
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
				service = service.charAt(0).toUpperCase() + service.slice(1);
				return service;
			}
		}
		return null;
	},
	getDateUser: function () {
		return moment(this.createdAt).locale(Session.get('activeLanguage')).format('LL');
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
			return moment(this.status.lastLogin.date).locale(Session.get('activeLanguage')).format('LLL');
		} else {
			return null;
		}
	},
	cardsetListUserAdmin: function () {
		var cardsets = Cardsets.find({owner: this._id});
		var fields = [];
		var dateString = null;
		var date = null;
		var kind = null;

		cardsets.forEach(function (cardset) {
			dateString = moment(cardset.date).locale(Session.get('activeLanguage')).format('LL');
			date = moment(cardset.date).format("YYYY-MM-DD");
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
						return new Spacebars.SafeString("<a id='linkToAdminUserCardset' class='editCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcardset') + "' data-cardsetid='" + value + "'><i class='glyphicon glyphicon-edit'></i></a>");
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
	'isVisible': function () {
		return this.visible;
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
				return !Roles.userIsInRole(currentUser, 'editor');
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

			return id !== currentUser;
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
		let user_id = this._id;
		let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		let email = $('#editUserEmailAdmin').val();
		let blockedtext = $('#editUserBlockedtextAdmin').val();
		let title = $('#editUserTitleAdmin').val();
		let birthname = $('#editUserBirthNameAdmin').val();
		let givenname = $('#editUserGivenNameAdmin').val();
		let check = re.test(email);
		let visible = null;
		let pro = ('true' === tmpl.find('#editUserProAdmin > .active > input').value);
		let lecturer = ('true' === tmpl.find('#editUserLecturerAdmin > .active > input').value);

		if ($('#profilepublicoption1Admin').hasClass('active')) {
			visible = true;
		} else if ($('#profilepublicoption2Admin').hasClass('active2')) {
			visible = false;
		}

		if (check === false && email !== "") {
			$('#editUserEmailLabelAdmin').css('color', '#b94a48');
			$('#editUserEmailAdmin').css('border-color', '#b94a48');
			$('#helpEditUserEmailAdmin').html(TAPi18n.__('admin.user.email_invalid'));
			$('#helpEditUserEmailAdmin').css('color', '#b94a48');
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
		if ((Session.get('userBlocked') && $('#editUserBlockedtextAdmin').val() !== "" || !Session.get('userBlocked')) &&
			(check === true || email === "") && (pro && visible || !pro) &&
			(lecturer && visible || !lecturer)) {
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
			Meteor.call('updateUsersTitle', title, user_id);
			Meteor.call('updateUsersBirthName', birthname, user_id);
			Meteor.call('updateUsersGivenName', givenname, user_id);
			Meteor.call('updateUsersProfileState',
				(email !== "" && birthname !== "" && givenname !== "") ? true : false,
				user_id);
			window.history.go(-1);
		}
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
		Meteor.call("deleteUserProfile", id);
		window.history.go(-1);
	},
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var cardset = this;

		if (event.target.className === "deleteCardsetAdmin btn btn-xs btn-default" || event.target.className === "glyphicon glyphicon-ban-circle") {
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
	},
	'click #profilepublicoption1Admin': function () {
		$('#profilepublicoption1Admin').addClass('active');
		$('#profilepublicoption2Admin').removeClass('active2');
	},
	'click #profilepublicoption2Admin': function () {
		$('#profilepublicoption2Admin').addClass('active2');
		$('#profilepublicoption1Admin').removeClass('active');
	},
	'click #blockedOption1Admin': function () {
		$('#blockedOption1Admin').addClass('active2');
		$('#blockedOption2Admin').removeClass('active');
	},
	'click #blockedOption2Admin': function () {
		$('#blockedOption1Admin').removeClass('active2');
		$('#blockedOption2Admin').addClass('active');
	},
	'click #editorOption1Admin': function () {
		$('#editorOption1Admin').addClass('active');
		$('#editorOption2Admin').removeClass('active2');
	},
	'click #editorOption2Admin': function () {
		$('#editorOption1Admin').removeClass('active');
		$('#editorOption2Admin').addClass('active2');
	},
	'click #lecturerOption1Admin': function () {
		$('#lecturerOption1Admin').addClass('active');
		$('#lecturerOption2Admin').removeClass('active2');
	},
	'click #lecturerOption2Admin': function () {
		$('#lecturerOption1Admin').removeClass('active');
		$('#lecturerOption2Admin').addClass('active2');
	},
	'click #proOption1Admin': function () {
		$('#proOption1Admin').addClass('active');
		$('#proOption2Admin').removeClass('active2');
	},
	'click #proOption2Admin': function () {
		$('#proOption1Admin').removeClass('active');
		$('#proOption2Admin').addClass('active2');
	},
	'click #eduOption1Admin': function () {
		$('#eduOption1Admin').addClass('active');
		$('#eduOption2Admin').removeClass('active2');
	},
	'click #eduOption2Admin': function () {
		$('#eduOption1Admin').removeClass('active');
		$('#eduOption2Admin').addClass('active2');
	}
});
