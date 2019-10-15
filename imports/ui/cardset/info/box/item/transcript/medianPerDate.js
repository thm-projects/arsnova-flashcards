//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {TranscriptBonusList} from "../../../../../../api/transcriptBonus";
import "./medianPerDate.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptMedianPerDate
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptMedianPerDate.helpers({
	getMedian: function (cardset) {
		if (cardset.transcriptBonus !== undefined && cardset.transcriptBonus.stats !== undefined) {
			return TranscriptBonusList.transformMedian(cardset.transcriptBonus.stats.submissions / cardset.transcriptBonus.lectures.length);
		} else {
			return 0;
		}
	}
});
