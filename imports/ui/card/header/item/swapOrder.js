import {Session} from "meteor/session";
import "./swapOrder.html";
import {CardEditor} from "../../../../api/cardEditor";
import {CardType} from "../../../../api/cardTypes";

/*
 * ############################################################################
 * cardHeaderItemSwapOrder
 * ############################################################################
 */

Template.cardHeaderItemSwapOrder.helpers({
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	gotOneColumn: function () {
		return CardType.gotOneColumn(this.cardType);
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

Template.cardHeaderItemSwapOrder.events({
	"click .swapOrder": function () {
		if (Session.get('reverseViewOrder')) {
			Session.set('reverseViewOrder', false);
			CardEditor.editFront();
		} else {
			Session.set('reverseViewOrder', true);
			CardEditor.editBack();
		}
		Session.set('isQuestionSide', true);
	}
});
