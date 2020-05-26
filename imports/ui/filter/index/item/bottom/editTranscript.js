import "./editTranscript.html";
import {Template} from "meteor/templating";
import {Route} from "../../../../../api/route";
import {TranscriptBonus} from "../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../api/transcriptBonus";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * filterIndexItemBottomEditTranscript
 * ############################################################################
 */

Template.filterIndexItemBottomEditTranscript.helpers({
	isBonusTranscriptsRouteAndDeadlineExpired: function () {
		if (Route.isMyBonusTranscripts() || Route.isTranscriptBonus()) {
			let bonusTranscript = TranscriptBonus.findOne({card_id: this._id});
			if (bonusTranscript !== undefined) {
				return TranscriptBonusList.isDeadlineExpired(bonusTranscript, true);
			}
		}
	}
});

Template.filterIndexItemBottomEditTranscript.events({
	'click .editCard': function (event) {
		FlowRouter.go('editTranscript', {card_id: $(event.target).data('id')});
	}
});
