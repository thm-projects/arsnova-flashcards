//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import {CardIndex} from "../../../api/cardIndex";
import {CardVisuals} from "../../../api/cardVisuals";
import {Session} from "meteor/session";
import {CardType} from "../../../api/cardTypes";
import './header/header.js';
import './content/content.js';
import './side.html';
import {CardNavigation} from "../../../api/cardNavigation";

Template.cardSide.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	cardsIndex: function (card_id) {
		return CardIndex.getActiveCardIndex(card_id);
	},
	getCardSideColor: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, this.isActive, this.forceSide);
	},
	isActive: function () {
		if (this.forceSide === undefined && this.isActive) {
			return true;
		}
	},
	isHiddenQuestion: function () {
		if ((Route.isMemo() || Route.isBox()) && Session.get('is3DActive')) {
			let side = CardNavigation.getCubeSidePosition(0);
			let isCube = false;
			if (this.forceSide) {
				side = this.forceSide;
				isCube = true;
			}
			if (Session.get('swapAnswerQuestion')) {
				if (!CardType.getSideData(this.cardType, side).isAnswer && (Session.get('isQuestionSide') || !isCube)) {
					return true;
				}
			} else {
				if (CardType.getSideData(this.cardType, side).isAnswer && (Session.get('isQuestionSide') || !isCube)) {
					return true;
				}
			}
		}
	}
});
