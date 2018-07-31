//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {APIAccess} from "../../../api/cardsetAPI.js";
import {Cardsets} from "../../../api/cardsets.js";
import "./admin_apiAccess.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * admin_apiAccess
 * ############################################################################
 */

Meteor.subscribe("apiAccess");
Meteor.subscribe("cardsets");

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
				{key: 'token', label: TAPi18n.__('admin.apiToken')},
				{
					key: 'cardset_id',
					label: TAPi18n.__('admin.api.exportCardset'),
					sortable: false,
					cellClass: 'edit',
					fn: function (value) {
						return new Spacebars.SafeString("<button id='" + value + "' class='exportAPICardset btn btn-xs btn-raised'><i class='fa fa-cloud-download'></i> " + TAPi18n.__('export.filename.export') + "</button>");
					}
				},
				{
					key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function () {
						return new Spacebars.SafeString("<a class='deleteApiAccessAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecardset') + "' data-toggle='modal' data-target='#cardsetConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
					}
				}
			]
		};
	}
});

Template.admin_apiAccess.events({
	'click .exportAPICardset': function (e) {
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
	}
});
