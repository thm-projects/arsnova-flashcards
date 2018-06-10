import "./dictionary.html";
import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";

/*
 * ############################################################################
 * cardHeaderItemDictionary
 * ############################################################################
 */

Template.cardHeaderItemDictionary.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	isDictionary: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryPreview');
		}
	}
});
