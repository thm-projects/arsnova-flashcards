import "./deny.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../../api/cardNavigation";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import * as config from "../../../../config/transcriptBonus.js";

Session.setDefault('checkedTranscriptDenyReasons', []);

/*
 * ############################################################################
 * cardModalTranscriptRatingDeny
 * ############################################################################
 */

Template.cardModalTranscriptRatingDeny.helpers({
	getReasons: function () {
		let reasons = [];
		for (let i = 1; i <= config.denyReasonCount; i++) {
			let reason = {};
			reason.text = TAPi18n.__('cardset.transcriptBonusRating.modal.deny.reason.content' + i);
			reason.id = i;
			reasons.push(reason);
		}
		return reasons;
	},
	gotReasonSelected: function () {
		return Session.get('checkedTranscriptDenyReasons').length > 0;
	}
});

Template.cardModalTranscriptRatingDeny.events({
	"click #denyTranscript": function () {
		CardNavigation.rateTranscript(false, Session.get('checkedTranscriptDenyReasons'));
		Session.set('isQuestionSide', true);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.transcriptBonusRating.notification.deny'), 'danger', 'growl-top-left');
		$('#cardModalTranscriptRatingDeny').modal('hide');
		$('.modal-backdrop').css('display', 'none');
	},
	"change .deny-reason-input": function () {
		let activeReasons = [];
		for (let i = 1; i <= config.denyReasonCount; i++) {
			if ($('#deny-reason-input-' + i + ':checked').length) {
				activeReasons.push(i);
			}
		}
		Session.set('checkedTranscriptDenyReasons', activeReasons);
	}
});

Template.cardModalTranscriptRatingDeny.onRendered(function () {
	$('#cardModalTranscriptRatingDeny').on('hidden.bs.modal', function () {
		Session.set('checkedTranscriptDenyReasons', []);
		$(".deny-reason-input").prop("checked", false);
	}).modal('hide');
});
