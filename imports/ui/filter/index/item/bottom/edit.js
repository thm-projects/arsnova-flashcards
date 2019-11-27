import "./edit.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";

/*
 * ############################################################################
 * filterIndexItemBottomEdit
 * ############################################################################
 */

Template.filterIndexItemBottomEdit.events({
	'click .editShuffle': function (event) {
		event.preventDefault();
		Router.go('editshuffle', {
			_id: $(event.target).data('id')
		});
	},
	'click .editCardset, click .editAdminCardset': function (event) {
		Session.set('isNewCardset', false);
		Session.set('activeCardset', Cardsets.findOne($(event.target).data('id')));
		Session.set('previousCardsetData', Cardsets.findOne($(event.target).data('id')));
	}
});
