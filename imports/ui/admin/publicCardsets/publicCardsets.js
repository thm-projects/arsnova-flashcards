import './publicCardsets.html';
import {APIAccess} from "../../../api/subscriptions/cardsetApiAccess";
import {Cardsets} from "../../../api/subscriptions/cardsets";

Meteor.subscribe("public-cardsets");

Template.admin_publicCardsets.helpers({
	publicCardsets: function () {
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
				{key: 'cardset', label: TAPi18n.__('admin.public-cardsets.cardset')},
				{key: 'user', label: TAPi18n.__('admin.public-cardsets.user')},
				{
					key: 'accept',
					label: TAPi18n.__('admin.public-cardsets.accept'),
					sortable: false,
					fn: function (value) {
						return new Spacebars.SafeString("<a id='" + value + "' class='confirmPublicCardsetsAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.public-cardsets.accept') + "'><i class=\"far fa-check-circle\"></i></a>");
					}
				},
				{
					key: 'decline',
					label: TAPi18n.__('admin.public-cardsets.decline'),
					sortable: false,
					fn: function (value) {
						return new Spacebars.SafeString("<a id='" + value + "' class='declinePublicCardsetsAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.public-cardsets.decline') + "'><i class='fas fa-ban'></i></a>");
					}
				}
			]
		};
	}
});
