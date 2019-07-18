import "./aboutThisRating.html";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * aboutThisRatingModal
 * ############################################################################
 */

Template.aboutThisRatingModal.helpers({
	gotAccepted: function () {
		if (Session.get('activeTranscript') !== undefined) {
			return Session.get('activeTranscript').rating === 1;
		}
	},
	getStarsRating: function () {
		if (Session.get('activeTranscript') !== undefined) {
			return Session.get('activeTranscript').stars;
		}
	},
	getStarsRatingDescription: function () {
		if (Session.get('activeTranscript') !== undefined) {
			return TAPi18n.__('cardset.transcriptBonusRating.modal.accept.stars' + Session.get('activeTranscript').stars);
		}
	},
	getReasons: function () {
		if (Session.get('activeTranscript') !== undefined) {
			let reasons = Session.get('activeTranscript').reasons;
			let reasonContent = [];
			for (let i = 0; i < reasons.length; i++) {
				let reason = {};
				reason.text = TAPi18n.__('cardset.transcriptBonusRating.modal.deny.reason.content' + reasons[i]);
				reasonContent.push(reason);
			}
			return reasonContent;
		}
	},
	getReasonsCount: function () {
		if (Session.get('activeTranscript') !== undefined) {
			return Session.get('activeTranscript').reasons.length;
		}
	}
});
