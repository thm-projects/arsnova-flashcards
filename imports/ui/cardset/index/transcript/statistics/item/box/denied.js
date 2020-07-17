import "./denied.html";
import {TranscriptBonusList} from "../../../../../../../util/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxDenied
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxDenied.helpers({
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	},
	getSubmissions: function (cardset_id, user_id, type) {
		return TranscriptBonusList.getSubmissions(cardset_id, user_id, type);
	}
});
