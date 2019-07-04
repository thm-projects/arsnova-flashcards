import "./bonus.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxBonus
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxBonus.helpers({
	getAchievedBonus: function (cardset_id, user_id) {
		return TranscriptBonusList.getAchievedBonus(cardset_id, user_id);
	}
});
