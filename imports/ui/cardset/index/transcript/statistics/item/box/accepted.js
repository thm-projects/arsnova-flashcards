import "./accepted.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxAccepted
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxAccepted.helpers({
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	},
	getSubmissions: function (cardset_id, user_id, type) {
		return TranscriptBonusList.getSubmissions(cardset_id, user_id, type);
	}
});
