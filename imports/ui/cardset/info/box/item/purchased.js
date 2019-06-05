//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Paid} from "../../../../../api/paid";
import "./purchased.html";

/*
* ############################################################################
* cardsetInfoBoxItemPurchased
* ############################################################################
*/

Template.cardsetInfoBoxItemPurchased.helpers({
	isPurchased: function () {
		return Paid.findOne({cardset_id: this._id}) !== undefined;
	},
	getDateOfPurchase: function () {
		return moment(Paid.findOne({cardset_id: this._id}).dateCreated).locale(Session.get('activeLanguage')).format('LL');
	}
});
