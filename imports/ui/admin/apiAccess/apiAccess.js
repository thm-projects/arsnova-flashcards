//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {APIAccess} from "../../../api/subscriptions/cardsetApiAccess";
import {Cardsets} from "../../../api/subscriptions/cardsets.js";
import "./apiAccess.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * admin_apiAccess
 * ############################################################################
 */

Meteor.subscribe("apiAccess");

Template.admin_apiAccess.helpers({
	apiAccessTokens: function () {
		var tokenItems = [];
		var apiAccessTokens = APIAccess.find({});
		apiAccessTokens.forEach(function (token) {
			var cardset = Cardsets.findOne({_id: token.cardset_id});
			tokenItems.push({
				"_id": token._id,
				"cardset_id": token.cardset_id,
				"cardset": cardset.name,
				"token": token.token
			});
		});

		return tokenItems;
	},
	tableSettings: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			fields: [
				{key: 'cardset', label: TAPi18n.__('admin.cardset.header')},
				{key: 'token', label: TAPi18n.__('admin.api.token')},
				{
					key: 'cardset_id',
					label: TAPi18n.__('admin.api.exportCardset'),
					sortable: false,
					cellClass: 'edit',
					fn: function (value) {
						return new Spacebars.SafeString("<button id='" + value + "' class='exportAPICardset btn btn-xs btn-raised'><span class=\"fas fa-archive\"></span> <span class='fas fa-cloud-download-alt'></span> " + TAPi18n.__('export.filename.export') + "</button>");
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.delete'),
					sortable: false,
					fn: function (value) {
						return new Spacebars.SafeString("<a rel='noopener noreferrer'   id='" + value + "' class='deleteApiAccessAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.api.delete') + "' data-toggle='modal' data-target='#admin_deleteApiAccessForm'><span class='fas fa-ban'></span></a>");
					}
				}
			]
		};
	}
});

Template.admin_apiAccess.events({
	'click .exportAPICardset': function () {
		let cId = event.target.id;
		Meteor.call('exportCards', cId, true, function (error, result) {
			if (error) {
				Bert.alert(TAPi18n.__('export.cards.failure'), 'danger', 'growl-top-left');
			} else {
				let exportData = new Blob([result], {
					type: "application/json"
				});
				saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cards') + "_" + name + moment().format('_YYYY_MM_DD') + ".json");
			}
		});
	},
	'click .deleteApiAccessAdmin': function (event) {
		event.preventDefault();
		let apiAccessId = $(event.target).closest("a").attr("id");
		Session.set("apiAccessId", apiAccessId);

		$('#apiAccessConfirmModalAdmin').modal('show');
	}
});

Template.admin_newApiAccessForm.events({
	'click #apiAccessSave': function () {
		Meteor.call('newAPIAccess', $("#apiCardsetId").val(), function (error) {
			if (error) {
				Bert.alert(TAPi18n.__('admin.api.createFailure'), 'danger', 'growl-top-left');
			}
		});
	}
});

Template.admin_deleteApiAccessForm.events({
	'click #apiAccessDeleteAdmin': function () {
		let apiAccessId = Session.get("apiAccessId");

		Meteor.call('deleteAPIAccess', apiAccessId, function (error) {
			if (error) {
				Bert.alert(TAPi18n.__('admin.api.createFailure'), 'danger', 'growl-top-left');
			}
		});
		$('#apiAccessConfirmModalAdmin').modal('hide');
	}
});
