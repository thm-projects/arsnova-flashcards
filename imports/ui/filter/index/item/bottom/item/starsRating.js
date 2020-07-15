import "./starsRating.html";
import {Template} from "meteor/templating";
import {TranscriptBonus} from "../../../../../../api/subscriptions/transcriptBonus";

/*
 * ############################################################################
 * filterIndexItemBottomStarsRating
 * ############################################################################
 */

Template.filterIndexItemBottomStarsRating.helpers({
	getBonusTranscriptStarsNumber: function (id) {
		return TranscriptBonus.findOne({card_id: id}).stars;
	},
	getBonusTranscriptStars: function (id) {
		let stars = TranscriptBonus.findOne({card_id: id}).stars;
		let starData = [];
		for (let i = 0; i < 5; i++) {
			let star = {};
			if (i < stars) {
				star.status = "rated";
			} else {
				star.status = "";
			}
			starData.push(star);
		}
		return starData;
	},
	getBonusTranscriptStarsTooltip: function (id) {
		let stars = TranscriptBonus.findOne({card_id: id}).stars;
		return TAPi18n.__('cardset.transcriptBonusRating.starsLabel.stars' + stars);
	},
	gotAccepted: function (id) {
		let transcriptBonus = TranscriptBonus.findOne({card_id: id});
		if (transcriptBonus !== undefined) {
			return transcriptBonus.rating === 1;
		}
	}
});
