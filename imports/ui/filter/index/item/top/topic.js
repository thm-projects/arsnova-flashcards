import "./topic.html";
import {Route} from "../../../../../util/route";
import {TranscriptBonus} from "../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../api/transcriptBonus";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


/*
 * ############################################################################
 * filterIndexItemTopTopic
 * ############################################################################
 */

Template.filterIndexItemTopTopic.events({
	'click .resultName': function (event) {
		event.preventDefault();
		if (Route.isTranscript() || Route.isTranscriptBonus()) {
			if (Route.isMyTranscripts()) {
				FlowRouter.go('presentationTranscriptPersonal', {
					card_id: $(event.target).data('id')
				});
			} else if (Route.isMyBonusTranscripts()) {
				FlowRouter.go('presentationTranscriptBonus', {
					card_id: $(event.target).data('id')
				});
			} else {
				Session.set('transcriptBonusReviewCount', $(event.target).data('id'));
				FlowRouter.go('presentationTranscriptBonusCardset', {
					_id: FlowRouter.getParam('_id'),
					card_id: $(event.target).data('id')
				});
			}
		} else {
			FlowRouter.go('cardsetdetailsid', {
				_id: $(event.target).data('id')
			});
		}
	}
});

Template.filterIndexItemTopTopic.helpers({
	getBonusLectureName: function () {
		let bonusTranscript = TranscriptBonus.findOne({card_id: this._id});
		if (bonusTranscript !== undefined) {
			bonusTranscript.name = Cardsets.findOne({_id: bonusTranscript.cardset_id}).name;
			return TranscriptBonusList.getLectureName(bonusTranscript);
		}
	}
});
