//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./lectureEnd.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptLectureEnd
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptLectureEnd.helpers({
	getLectureEnd: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			return cardset.transcriptBonus.lectureEnd;
		}
	}
});
