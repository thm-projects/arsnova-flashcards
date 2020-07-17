import {Profile} from "../../../../util/profile";
import {Session} from "meteor/session";
import {SweetAlertMessages} from "../../../../util/sweetAlert";
import {Template} from "meteor/templating";
import "./createRepetitoriumButton.html";

/*
 * ############################################################################
 * filterItemCreateRepetitoriumButton
 * ############################################################################
 */

Template.filterItemCreateRepetitoriumButton.events({
	'click #newRepetitorium': function () {
		if (Profile.isCompleted()) {
			Session.set('isNewCardset', true);
			Session.set('useRepForm', true);
			$('#setCardsetFormModal').modal('show');
		} else {
			SweetAlertMessages.completeProfile();
		}
	}
});
