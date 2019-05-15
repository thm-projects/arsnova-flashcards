//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusMaxPoints.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptBonusMaxPoints
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptBonusMaxPoints.helpers({
	getBonusPoints: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			return cardset.transcriptBonus.percentage;
		}
	}
});
