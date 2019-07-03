import "./denied.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserDenied
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserDenied.helpers({
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	},
	getSubmissions: function (user_id, type) {
		return TranscriptBonusList.getSubmissions(user_id, type);
	}
});
