import "./submissions.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserSubmissions
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserSubmissions.helpers({
	getSubmissions: function (cardset_id, user_id, type) {
		return TranscriptBonusList.getSubmissions(cardset_id, user_id, type);
	}
});
