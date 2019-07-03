import "./submissions.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserSubmissions
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserSubmissions.helpers({
	getSubmissions: function (user_id, type) {
		return TranscriptBonusList.getSubmissions(user_id, type);
	}
});
