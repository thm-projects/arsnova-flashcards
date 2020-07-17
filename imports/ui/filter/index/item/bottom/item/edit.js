import "./edit.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../../../api/subscriptions/cardsets";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * filterIndexItemBottomEdit
 * ############################################################################
 */

Template.filterIndexItemBottomEdit.events({
	'click .editShuffle': function (event) {
		event.preventDefault();
		FlowRouter.go('editshuffle', {
			_id: $(event.target).data('id')
		});
	},
	'click .editCardset, click .editAdminCardset': function (event) {
		let cardset = Cardsets.findOne($(event.target).data('id'));
		Session.set('isNewCardset', false);
		if (cardset.shuffled) {
			Session.set('useRepForm', true);
		} else {
			Session.set('useRepForm', false);
		}
		Session.set('activeCardset', cardset);
		Session.set('previousCardsetData', cardset);
	}
});
