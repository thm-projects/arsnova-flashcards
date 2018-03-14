import "./cardTypesList.html";
import {Template} from "meteor/templating";
import {
	cardTypesOrder, getCardTypeName,
	gotNotesForDifficultyLevel
} from "../../api/cardTypes";
import {Cardsets} from "../../api/cardsets";
import {query, filterCardType, prepareQuery} from "../pool/pool";
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
		if (!gotNotesForDifficultyLevel(this.cardType)) {
			prepareQuery();
			query.cardType = this.cardType;
			return Cardsets.findOne(query);
		}
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
