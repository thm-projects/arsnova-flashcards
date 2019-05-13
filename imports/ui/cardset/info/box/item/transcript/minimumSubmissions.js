//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./minimumSubmissions.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptMinimumSubmissions
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptMinimumSubmissions.helpers({
	getMinimumSubmissions: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			return cardset.transcriptBonus.minimumSubmissions;
		}
	}
});
