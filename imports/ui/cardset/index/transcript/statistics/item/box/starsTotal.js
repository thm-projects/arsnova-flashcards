import "./starsTotal.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxStarsTotal
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxStarsTotal.helpers({
	getStarsTotal: function (cardset_id, user_id, type) {
		return TranscriptBonusList.getStarsData(cardset_id, user_id, type);
	}
});
