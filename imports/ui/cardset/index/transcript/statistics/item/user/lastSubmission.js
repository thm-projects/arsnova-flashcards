import "./lastSubmission.html";
import {TranscriptBonus, TranscriptBonusList} from "../../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemUserLastSubmission
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemUserLastSubmission.helpers({
	lastSubmission: function (id) {
		let bonusTranscript = TranscriptBonus.findOne({user_id: id}, {sort: {date: -1}});
		if (bonusTranscript !== undefined) {
			return TranscriptBonusList.getLectureName(bonusTranscript, false);
		}
	}
});
