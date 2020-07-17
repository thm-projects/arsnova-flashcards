//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Route} from "../../../util/route";
import {CardIndex} from "../../../util/cardIndex";
import {CardVisuals} from "../../../util/cardVisuals";
import {Session} from "meteor/session";
import {CardType} from "../../../util/cardTypes";
import './header/header.js';
import './content/content.js';
import './answers/answers.js';
import './side.html';
import {CardNavigation} from "../../../util/cardNavigation";

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
			let sideData = CardType.getSideData(this.cardType, side);
			if (sideData !== undefined) {
				if (Session.get('swapAnswerQuestion')) {
					if (!sideData.isAnswer && (Session.get('isQuestionSide') || !isCube)) {
						return true;
					}
				} else {
					if (sideData.isAnswer && (Session.get('isQuestionSide') || !isCube)) {
						return true;
					}
				}
			}
		}
	}
});
