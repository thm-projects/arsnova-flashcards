//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./submissions.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptSubmissions
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptSubmissions.helpers({
	getSubmissions: function (cardset) {
		if (cardset.transcriptBonus !== undefined && cardset.transcriptBonus.stats !== undefined) {
			return cardset.transcriptBonus.stats.submissions;
		} else {
			return 0;
		}
	}
});
