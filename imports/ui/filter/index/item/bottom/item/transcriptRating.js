import "./transcriptRating.html";
import {Template} from "meteor/templating";
import {TranscriptBonus} from "../../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../../util/transcriptBonus";

/*
 * ############################################################################
 * filterIndexItemBottomTranscriptRating
 * ############################################################################
 */

Template.filterIndexItemBottomTranscriptRating.helpers({
	getBonusTranscriptRating: function (id) {
		let transcriptBonus = TranscriptBonus.findOne({card_id: id});
		if (transcriptBonus !== undefined) {
			return TranscriptBonusList.getBonusTranscriptRating(transcriptBonus.rating);
		} else {
			return 0;
		}
	},
	getBonusTranscriptTooltip: function (id) {
		let transcriptBonus = TranscriptBonus.findOne({card_id: id});
		if (transcriptBonus !== undefined) {
			return TranscriptBonusList.getBonusTranscriptTooltip(transcriptBonus.rating);
		} else {
			return 0;
		}
	},
	getBonusTranscriptRatingNumber: function (id) {
		return TranscriptBonus.findOne({card_id: id}).rating;
	}
});
