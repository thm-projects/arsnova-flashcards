//import {Profile} from "../../../../util/profile";
//import {Session} from "meteor/session";
//import {SweetAlertMessages} from "../../../../util/sweetAlert";
import "./createErrorListingButton.html";

/*
 * ############################################################################
 * filterMyErrorsButton
 * ############################################################################
 */

Template.filterMyErrorsButton.events({
	'click #myErrors': function () {
		/* if (Profile.isCompleted()) {
			Session.set('isNewCardset', true);
			Session.set('useRepForm', false);
			$('#setCardsetFormModal').modal('show');
		} else {
			SweetAlertMessages.completeProfile();
		}*/
	}
});
