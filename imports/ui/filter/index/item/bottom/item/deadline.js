import "./deadline.html";
import {Template} from "meteor/templating";
import {TranscriptBonus} from "../../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../../util/transcriptBonus";

/*
 * ############################################################################
 * filterIndexItemBottomDeadline
 * ############################################################################
 */

Template.filterIndexItemBottomDeadline.helpers({
	getBonusLectureDeadline: function (displayMode = 0) {
		let bonusTranscript = TranscriptBonus.findOne({card_id: this._id});
		if (bonusTranscript !== undefined) {
			return TranscriptBonusList.getDeadlineEditing(bonusTranscript, bonusTranscript.date, displayMode);
		}
	},
	getLectureDate: function () {
		let bonusTranscript = TranscriptBonus.findOne({card_id: this._id});
		if (bonusTranscript !== undefined) {
			return bonusTranscript.date.getTime();
		}
	},
	getCardset: function () {
		let bonusTranscript = TranscriptBonus.findOne({card_id: this._id});
		if (bonusTranscript !== undefined) {
			return bonusTranscript.cardset_id;
		}
	}
});
