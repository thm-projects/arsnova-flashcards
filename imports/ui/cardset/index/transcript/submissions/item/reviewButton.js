import "./reviewButton.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {TranscriptBonus} from "../../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../../util/transcriptBonus";
import {FilterNavigation} from "../../../../../../util/filterNavigation";
import {Filter} from "../../../../../../util/filter";

Session.setDefault('transcriptBonusReviewCount', 0);
Session.setDefault('transcriptBonusReviewFilter', undefined);

/*
 * ############################################################################
 * cardsetIndexTranscriptSubmissionsItemReviewButton
 * ############################################################################
 */

Template.cardsetIndexTranscriptSubmissionsItemReviewButton.onCreated(function () {
	let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(FlowRouter.getParam('_id'));
	if (latestExpiredDeadline !== undefined) {
		let query = Filter.getFilterQuery();
		query.cardset_id = FlowRouter.getParam('_id');
		query.date = {$lt: latestExpiredDeadline};
		query.rating = 0;
		Session.set('transcriptBonusReviewCount', TranscriptBonus.find(query).count());
	} else {
		Session.set('transcriptBonusReviewCount', -1);
	}
});

Template.cardsetIndexTranscriptSubmissionsItemReviewButton.helpers({
	getInfoText: function () {
		let query = Filter.getFilterQuery();
		query.cardset_id = FlowRouter.getParam('_id');
		query.rating = 0;
		query.card_id = query._id;
		if (FilterNavigation.isFilterActive()) {
			Session.set('transcriptBonusReviewFilter', query.card_id);
		} else {
			Session.set('transcriptBonusReviewFilter', undefined);
		}
		delete query._id;
		let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(FlowRouter.getParam('_id'));
		query.date = {$lt: latestExpiredDeadline};
		Session.set('transcriptBonusReviewCount', TranscriptBonus.find(query).count());
		let text = '';
		if (FilterNavigation.isFilterActive()) {
			text += '<i class="fas fa-filter navigationFilterIcon"></i>&nbsp;';
		}
		if (Session.get('transcriptBonusReviewCount') === 0) {
			delete query.date;
			let bonusTranscript = TranscriptBonus.findOne(query);
			if (bonusTranscript !== undefined) {
				let nextDate = TranscriptBonusList.getDeadlineEditing(bonusTranscript, bonusTranscript.date, 1);
				return text + TAPi18n.__('transcriptForm.bonus.submissions.info.next', {date: nextDate}, Session.get('activeLanguage'));
			}
		}
		switch (Session.get('transcriptBonusReviewCount')) {
			case -1:
			case 0:
				return text + TAPi18n.__('transcriptForm.bonus.submissions.info.nothing', {}, Session.get('activeLanguage'));
			default:
				return text + TAPi18n.__('transcriptForm.bonus.submissions.info.found', {count: Session.get('transcriptBonusReviewCount')}, Session.get('activeLanguage'));
		}
	},
	gotTranscriptsToReview: function () {
		return Session.get('transcriptBonusReviewCount') > 0;
	},
	isFilterActive: function () {
		return FilterNavigation.isFilterActive();
	}
});

Template.cardsetIndexTranscriptSubmissionsItemReviewButton.events({
	"click #reviewTranscripts": function () {
		FlowRouter.go('presentationTranscriptReview', {
			_id: FlowRouter.getParam('_id')
		});
	}
});
