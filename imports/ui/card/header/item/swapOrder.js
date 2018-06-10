import {Session} from "meteor/session";
import "./swapOrder.html";
import {Route} from "../../../../api/route";
import {CardEditor} from "../../../../api/cardEditor";
import {CardType} from "../../../../api/cardTypes";
import {CardVisuals} from "../../../../api/cardVisuals";

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
	"click #swapOrder": function () {
		if (Session.get('reverseViewOrder')) {
			Session.set('reverseViewOrder', false);
			if (Route.isEditMode()) {
				CardVisuals.turnFront(true);
			} else {
				if (Route.isPresentation()) {
					CardEditor.editFront();
				} else {
					CardVisuals.turnFront();
				}
			}
		} else {
			Session.set('reverseViewOrder', true);
			if (Route.isEditMode()) {
				CardVisuals.turnBack(true);
			} else {
				if (Route.isPresentation()) {
					CardEditor.editBack();
				} else {
					CardVisuals.turnBack();
				}
			}
		}
	}
});
