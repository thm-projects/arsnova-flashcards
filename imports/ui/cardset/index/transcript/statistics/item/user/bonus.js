import "./bonus.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserBonus
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserBonus.helpers({
	getAchievedBonus: function (cardset_id, user_id) {
		return TranscriptBonusList.getAchievedBonus(cardset_id, user_id);
	}
});
