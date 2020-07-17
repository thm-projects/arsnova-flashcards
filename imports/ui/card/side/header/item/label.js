import {CardType} from "../../../../../util/cardTypes";
import "./label.html";

/*
 * ############################################################################
 * cardContentItemLabel
 * ############################################################################
 */

Template.cardContentItemLabel.helpers({
	gotDifficulty: function (cardType) {
		return CardType.gotDifficultyLevel(cardType);
	}
});
