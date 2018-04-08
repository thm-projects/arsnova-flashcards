import "./cardTypesList.html";
import {Template} from "meteor/templating";
import {
	cardTypesOrder, getCardTypeName
} from "../../api/cardTypes";
import {Cardsets} from "../../api/cardsets";
import {filterCardType, prepareQuery} from "../filter/filter.js";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * category
 * ############################################################################
 */

Template.cardTypesList.helpers({
	getCardTypes: function () {
		return cardTypesOrder;
	},
	getCardTypeName: function () {
		return getCardTypeName(this.cardType);
	},
	filterCardTypes: function () {
		prepareQuery();
		let query = Session.get('filterQuery');
		query.cardType = this.cardType;
		return Cardsets.findOne(query);
	},
	poolFilterCardType: function (cardType) {
		return Session.get('poolFilterCardType') === cardType;
	}
});

Template.cardTypesList.events({
	'click .filterCardType': function (event) {
		filterCardType(event);
	}
});
