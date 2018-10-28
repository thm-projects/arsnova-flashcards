//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardType} from "../../../../../api/cardTypes";
import "./cardType.html";

/*
* ############################################################################
* cardsetInfoBoxItemCardType
* ############################################################################
*/

Template.cardsetInfoBoxItemCardType.helpers({
	getCardType: function () {
		return CardType.getCardTypeName(this.cardType);
	}
});
