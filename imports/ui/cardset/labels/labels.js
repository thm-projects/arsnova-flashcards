import {Meteor} from "meteor/meteor";
import {LearningStatus} from "../../../util/learningStatus";
import {Template} from "meteor/templating";
import './item/arsnovaClick.js';
import './item/errorReporting.js';
import './item/fragJetzt.js';
import './item/license';
import "./labels.html";
import {TranscriptBonus} from "../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../util/transcriptBonus";

/*
* ############################################################################
* cardsetInfo
* ############################################################################
*/

Template.cardsetLabels.helpers({
	getCardsetCardCount: function () {
		if (this.useLeitnerCount) {
			return LearningStatus.getCardsetCardCount(true);
		} else {
			return this.quantity;
		}
	},
	getBonusTranscriptCount: function (card_id) {
		if (card_id !== undefined) {
			let transcriptBonus = TranscriptBonus.findOne({card_id: card_id});
			if (transcriptBonus !== undefined) {
				return TranscriptBonusList.getSubmissions(transcriptBonus.cardset_id, Meteor.userId(), undefined);
			}
		}
	}
});
