import "./lastSubmission.html";
import {TranscriptBonus} from "../../../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxLastSubmission
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxLastSubmission.helpers({
	lastSubmission: function (cardset_id, user_id) {
		let bonusTranscript = TranscriptBonus.findOne({cardset_id: cardset_id, user_id: user_id}, {sort: {date: -1}});
		if (bonusTranscript !== undefined) {
			return TranscriptBonusList.getLectureName(bonusTranscript, false);
		}
	}
});
