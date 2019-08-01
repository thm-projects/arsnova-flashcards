//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./minimumStars.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptMinimumStars
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptMinimumStars.helpers({
	getMinimumStars: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			return cardset.transcriptBonus.minimumStars;
		}
	}
});
