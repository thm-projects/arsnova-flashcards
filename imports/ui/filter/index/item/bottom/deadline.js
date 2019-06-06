import "./deadline.html";
import {Template} from "meteor/templating";
import {TranscriptBonus, TranscriptBonusList} from "../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * filterIndexItemBottomDeadline
 * ############################################################################
 */

Template.filterIndexItemBottomDeadline.helpers({
	getBonusLectureDeadline: function () {
		let bonusTranscript = TranscriptBonus.findOne({card_id: this._id});
		if (bonusTranscript !== undefined) {
			return TranscriptBonusList.getDeadlineEditing(bonusTranscript, bonusTranscript.dateCreated);
		}
	}
});
