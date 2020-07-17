//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardType} from "../../../../../util/cardTypes";
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
