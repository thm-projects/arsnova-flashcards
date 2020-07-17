import "./pending.html";
import {TranscriptBonusList} from "../../../../../../../util/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxPending
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxPending.helpers({
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	},
	getSubmissions: function (cardset_id, user_id, type) {
		return TranscriptBonusList.getSubmissions(cardset_id, user_id, type);
	}
});
