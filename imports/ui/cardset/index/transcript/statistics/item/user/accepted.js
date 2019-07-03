import "./accepted.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserAccepted
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserAccepted.helpers({
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	},
	getSubmissions: function (user_id, type) {
		return TranscriptBonusList.getSubmissions(user_id, type);
	}
});
