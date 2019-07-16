import "./reviewButton.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {TranscriptBonus, TranscriptBonusList} from "../../../../../../api/transcriptBonus";

/*
 * ############################################################################
 * cardsetIndexTranscriptSubmissionsItemReviewButton
 * ############################################################################
 */
let count = 0;

Template.cardsetIndexTranscriptSubmissionsItemReviewButton.onCreated(function () {
	let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(Router.current().params._id);
	if (latestExpiredDeadline !== undefined) {
		count = TranscriptBonus.find({cardset_id: Router.current().params._id, date: {$lt: latestExpiredDeadline}, rating: 0}).count();
	} else {
		count = -1;
	}
});

Template.cardsetIndexTranscriptSubmissionsItemReviewButton.helpers({
	getInfoText: function () {
		if (count === 0) {
			if (TranscriptBonus.find({cardset_id: Router.current().params._id, rating: 0}).count()) {
				let bonusTranscript = TranscriptBonus.findOne({cardset_id: Router.current().params._id, rating: 0});
				let nextDate = TranscriptBonusList.getDeadlineEditing(bonusTranscript, bonusTranscript.date, true);
				return TAPi18n.__('transcriptForm.bonus.submissions.info.next', {date: nextDate}, Session.get('activeLanguage'));
			}
		}
		switch (count) {
			case -1:
			case 0:
				return TAPi18n.__('transcriptForm.bonus.submissions.info.nothing', {}, Session.get('activeLanguage'));
			default:
				return TAPi18n.__('transcriptForm.bonus.submissions.info.found', {count: count}, Session.get('activeLanguage'));
		}
	},
	gotTranscriptsToReview: function () {
		return count > 0;
	}
});

Template.cardsetIndexTranscriptSubmissionsItemReviewButton.events({
	"click #reviewTranscripts": function () {
		Router.go('presentationTranscriptReview', {
			_id: Router.current().params._id
		});
	}
});
