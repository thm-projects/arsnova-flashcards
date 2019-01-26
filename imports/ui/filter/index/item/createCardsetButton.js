import {Profile} from "../../../../api/profile";
import {Session} from "meteor/session";
import {SweetAlertMessages} from "../../../../api/sweetAlert";
import "./createCardsetButton.html";

/*
 * ############################################################################
 * filterItemCreateCardsetButton
 * ############################################################################
 */

Template.filterItemCreateCardsetButton.events({
	'click #newCardSet': function () {
		if (Profile.isCompleted()) {
			Session.set('isNewCardset', true);
			$('#setCardsetFormModal').modal('show');
		} else {
			SweetAlertMessages.completeProfile();
		}
	}
});
