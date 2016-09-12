//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Cardsets} from '../../../api/cardsets.js';

import './admin_cardsets.html';

import './admin_cardset.js';

/**
 * ############################################################################
 * admin_cardsets
 * ############################################################################
 */

Template.admin_cardsets.helpers({
	cardsetListAdmin: function () {
		var cardsets = Cardsets.find();
		var fields = [];
		var dateString = null;
		var date = null;
		var kind = null;

		cardsets.forEach(function (cardset) {
			dateString = moment(cardset.date).locale(getUserLanguage()).format('LL');
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
				"firstName": cardset.firstName,
				"owner": cardset.owner,
				"userDeleted": cardset.userDeleted,
				"dateString": dateString,
				"date": date
			});
		});

		return fields;
	},
	tableSettings: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			fields: [
				{key: 'name', label: TAPi18n.__('admin.name')},
				{key: 'kind', label: TAPi18n.__('admin.kind')},
				{
					key: 'username', label: TAPi18n.__('admin.users'), fn: function (value, object) {
						if (object.userDeleted) {
							return new Spacebars.SafeString("<span name='" + value + "'>" + value + " (" + TAPi18n.__('admin.deleted') + ")</span>");
						} else {
							return new Spacebars.SafeString("<span name='" + value + "'><a id='linkToAdminCardsetUser' href='#' data-userid='" + object.owner + "'>" + value + "</a></span>");
						}
					}
				},
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
						return new Spacebars.SafeString("<a id='linkToAdminCardset' class='editCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcardset') + "' data-cardsetid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
					}
				},
				{
					key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function () {
						return new Spacebars.SafeString("<a class='deleteCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecardset') + "' data-toggle='modal' data-target='#cardsetConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
					}
				}
			]
		};
	}
});

Template.admin_cardsets.events({
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var cardset = this;

		if (event.target.className == "deleteCardsetAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
			Session.set('cardsetId', cardset._id);
		}
	},
	'click #linkToAdminCardset': function (event) {
		var cardsetid = $(event.currentTarget).data("cardsetid");
		Router.go('admin_cardset', {_id: cardsetid});
	},
	'click #linkToAdminCardsetUser': function (event) {
		var userid = $(event.currentTarget).data("userid");
		Router.go('admin_user', {_id: userid});
	}
});

/**
 * ############################################################################
 * cardsetConfirmFormAdmin
 * ############################################################################
 */

Template.cardsetConfirmFormAdmin.events({
	'click #cardetDeleteAdmin': function () {
		var id = Session.get('cardsetId');

		$('#cardsetConfirmModalAdmin').on('hidden.bs.modal', function () {
			Meteor.call("deleteCardset", id);
		}).modal('hide');
	}
});
