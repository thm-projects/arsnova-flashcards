//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardType} from "../../../../../api/cardTypes";
import "./difficulty.html";

/*
* ############################################################################
* cardsetInfoBoxItemDifficulty
* ############################################################################
*/

Template.cardsetInfoBoxItemDifficulty.helpers({
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(this.cardType);
	},
	getDifficultyName: function () {
		if (CardType.gotNotesForDifficultyLevel(this.cardType)) {
			return TAPi18n.__('difficultyNotes' + this.difficulty);
		} else {
			return TAPi18n.__('difficulty' + this.difficulty);
		}
	}
});
