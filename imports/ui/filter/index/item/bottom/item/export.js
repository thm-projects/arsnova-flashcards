import {Template} from "meteor/templating";
import {Cardsets} from "../../../../../../api/subscriptions/cardsets";
import {Session} from "meteor/session";
import "./export.html";

/*
 * ############################################################################
 * filterIndexItemBottomExport
 * ############################################################################
 */

Template.filterIndexItemBottomExport.events({
	'click .exportCardset': function (event) {
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')});
		if (cardset !== undefined) {
			Session.set('activeCardset', cardset);
			$('#exportModal').modal('show');
		}
	}
});
