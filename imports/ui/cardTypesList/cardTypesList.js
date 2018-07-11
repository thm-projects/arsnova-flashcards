import "./cardTypesList.html";
import {Template} from "meteor/templating";
import {CardType} from "../../api/cardTypes";
import {Cardsets} from "../../api/cardsets";
import {Filter} from "../../api/filter";

/*
 * ############################################################################
 * category
 * ############################################################################
 */

Template.cardTypesList.helpers({
	getCardTypes: function () {
		return CardType.getCardTypesOrder();
	},
	getCardTypeLongName: function () {
		return CardType.getCardTypeLongName(this.cardType);
	},
	filterCardTypes: function (cardType) {
		let query = Filter.getFilterQuery();
		query.cardType = cardType;
		return Cardsets.find(query).count();
	},
	resultsFilterCardType: function (cardType) {
		return Filter.getFilterQuery().cardType === cardType;
	}
});
