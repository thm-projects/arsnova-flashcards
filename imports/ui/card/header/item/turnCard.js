import {Session} from "meteor/session";
import "./turnCard.html";
import {CardType} from "../../../../api/cardTypes";

/*
 * ############################################################################
 * cardHeaderItemTurnCard
 * ############################################################################
 */

Template.cardHeaderItemTurnCard.helpers({
	gotOneColumn: function () {
		return CardType.gotOneColumn(this.cardType);
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotBack: function () {
		if (CardType.gotOneColumn(this.cardType)) {
			return true;
		}
		if (CardType.gotBack(this.cardType)) {
			return this.back !== '' && this.back !== undefined;
		} else {
			return false;
		}
	}
});
