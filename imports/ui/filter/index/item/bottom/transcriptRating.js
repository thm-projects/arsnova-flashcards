import "./transcriptRating.html";
import {Template} from "meteor/templating";
import {TranscriptBonus, TranscriptBonusList} from "../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * filterIndexItemBottomTranscriptRating
 * ############################################################################
 */

Template.filterIndexItemBottomTranscriptRating.helpers({
	getBonusTranscriptRating: function (id) {
		let rating = TranscriptBonus.findOne({card_id: id}).rating;
		return TranscriptBonusList.getBonusTranscriptRating(rating);
	},
	getBonusTranscriptTooltip: function (id) {
		let rating = TranscriptBonus.findOne({card_id: id}).rating;
		return TranscriptBonusList.getBonusTranscriptTooltip(rating);
	},
	getBonusTranscriptRatingNumber: function (id) {
		return TranscriptBonus.findOne({card_id: id}).rating;
	}
});
