import "./pending.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserPending
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserPending.helpers({
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	},
	getSubmissions: function (user_id, type) {
		return TranscriptBonusList.getSubmissions(user_id, type);
	}
});
