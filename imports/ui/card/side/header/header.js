import {Template} from "meteor/templating";
import {Route} from "../../../../api/route";
import {CardType} from "../../../../api/cardTypes";
import "./header.html";
import "./left/left.js";
import "./right/right.js";
import "./center/center.js";
import "./item/clock.js";
import "./item/countCards.js";
import "./item/countCardsLeitner.js";

/*
 * ############################################################################
 * flashcardHeader
 * ############################################################################
 */

Template.flashcardHeader.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isPresentation: function () {
		return Route.isPresentation();
	},
	isMakingOf: function () {
		return Route.isMakingOf();
	},
	isDemo: function () {
		return Route.isDemo();
	},
	isEditMode: function () {
		return Route.isEditMode();
	},
	isBox: function () {
		return Route.isBox();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	gotContent: function () {
		if (this.forceSide) {
			return CardType.getSideData(this.cardType, this.forceSide);
		} else {
			return true;
		}
	}
});
