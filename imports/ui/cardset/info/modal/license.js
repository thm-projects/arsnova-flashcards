//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/cardsets.js";
import "./license.html";

/*
 * ############################################################################
 * showLicense
 * ############################################################################
 */

Template.showLicense.helpers({
	getTopic: function () {
		if (Session.get('selectedCardset')) {
			let item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return item.name;
		}
	},
	getLicenseCount: function () {
		if (Session.get('selectedCardset')) {
			let item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return (item.license.length > 0);
		}
	},
	getLicenseType: function (type) {
		if (Session.get('selectedCardset')) {
			let item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return (item.license.includes(type));
		}
	}
});
