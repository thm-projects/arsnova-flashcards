import "./aboutThisRating.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {TranscriptBonus} from "../../../../../api/transcriptBonus";

Session.set('activeTranscript', undefined);
/*
 * ############################################################################
 * filterIndexItemBottomAboutThisRating
 * ############################################################################
 */


Template.filterIndexItemBottomAboutThisRating.helpers({
	gotRated: function (card_id) {
		let transcriptBonus = TranscriptBonus.findOne({"card_id": card_id});
		if (transcriptBonus !== undefined) {
			return transcriptBonus.rating !== 0;
		}
	}
});

Template.filterIndexItemBottomAboutThisRating.events({
	'click .aboutThisRating': function (event) {
		Session.set('activeTranscript', TranscriptBonus.findOne({card_id: $(event.target).data('id')}));
	}
});
