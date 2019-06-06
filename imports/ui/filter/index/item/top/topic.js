import "./topic.html";
import {Route} from "../../../../../api/route";
import {TranscriptBonus, TranscriptBonusList} from "../../../../../api/transcriptBonus";
import {Cardsets} from "../../../../../api/cardsets";
import {Template} from "meteor/templating";



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
				Router.go('presentationTranscriptPersonal', {
					card_id: $(event.target).data('id')
				});
			} else if (Route.isMyBonusTranscripts()) {
				Router.go('presentationTranscriptBonus', {
					card_id: $(event.target).data('id')
				});
			} else {
				Router.go('presentationTranscriptBonusCardset', {
					_id: Router.current().params._id,
					card_id: $(event.target).data('id')
				});
			}
		} else {
			Router.go('cardsetdetailsid', {
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
