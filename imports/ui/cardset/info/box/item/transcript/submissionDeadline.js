//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./submissionDeadline.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptSubmissionDeadline
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptSubmissionDeadline.helpers({
	getSubmissionDeadline: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			return cardset.transcriptBonus.deadline;
		}
	}
});
