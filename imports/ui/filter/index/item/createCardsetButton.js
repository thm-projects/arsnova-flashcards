import {Profile} from "../../../../util/profile";
import {Session} from "meteor/session";
import {SweetAlertMessages} from "../../../../util/sweetAlert";
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
			Session.set('useRepForm', false);
			$('#setCardsetFormModal').modal('show');
		} else {
			SweetAlertMessages.completeProfile();
		}
	}
});
