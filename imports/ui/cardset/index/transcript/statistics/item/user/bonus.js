import "./bonus.html";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserBonus
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserBonus.helpers({
	getAchievedBonus: function (user_id) {
		return TranscriptBonusList.getAchievedBonus(user_id);
	}
});
