//------------------------ IMPORTS

import './header/header.js';
import './content/content.js';
import './side.html';
import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import {Session} from "meteor/session";
import {CardType} from "../../../api/cardTypes";
import {CardIndex} from "../../../api/cardIndex";
import {CardVisuals} from "../../../api/cardVisuals";

Template.cardSide.helpers({
	isActiveCard: function (resetData) {
		if (Route.isEditMode()) {
			return true;
		} else {
			if (Session.get('activeCard') === this._id) {
				if (resetData) {
					let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
					Session.set('cardType', this.cardType);
					Session.set('activeCardContentId', CardType.getActiveSideData(cubeSides, this.cardType));
					Session.set('activeCardStyle', CardType.getActiveSideData(cubeSides, this.cardType, 1));
				}
				return true;
			}
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	cardsIndex: function (card_id) {
		return CardIndex.getActiveCardIndex(card_id);
	},
	getCardSideColorActive: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, true);
	},
	getCardSideColorInactive: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, false);
	}
});
