import "./cardset.html";
import {Cardsets} from "../../../../../../../api/cardsets";

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
		Router.go('cardsetdetailsid', {
			_id: $(event.target).data('id')
		});
	}
});
