import "./cardset.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Cardsets} from "../../../../../../../api/subscriptions/cardsets";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxCardset
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxCardset.helpers({
	getCardsetName: function (cardset_id) {
		return Cardsets.findOne({_id: cardset_id}).name;
	}
});

Template.cardsetIndexTranscriptStatisticsItemBoxCardset.events({
	'click .info-box-cardset': function (event) {
		event.preventDefault();
		FlowRouter.go('cardsetdetailsid', {
			_id: $(event.target).data('id')
		});
	}
});
