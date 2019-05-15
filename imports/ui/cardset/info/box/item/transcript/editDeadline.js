//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./editDeadline.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptEditDeadline
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptEditDeadline.helpers({
	getEditDeadline: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			return cardset.transcriptBonus.deadlineEditing;
		}
	}
});
