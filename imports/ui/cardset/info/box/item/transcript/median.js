//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {TranscriptBonusList} from "../../../../../../api/transcriptBonus";
import "./median.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptMedian
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptMedian.helpers({
	getMedian: function (cardset) {
		if (cardset.transcriptBonus !== undefined && cardset.transcriptBonus.stats !== undefined) {
			return TranscriptBonusList.transformMedian(cardset.transcriptBonus.stats.submissions / cardset.transcriptBonus.stats.participants);
		} else {
			return 0;
		}
	}
});
