//import {Profile} from "../../../../util/profile";
//import {Session} from "meteor/session";
//import {SweetAlertMessages} from "../../../../util/sweetAlert";
import "./createErrorListingButton.html";
import {Template} from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

const hasErrors = new ReactiveVar(false);

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

Template.filterMyErrorsButton.helpers({
	hasErrorReportings: () => hasErrors.get()
});

Template.filterMyErrorsButton.onCreated(() => {
	Meteor.call("hasErrorReportings", (err, result) => hasErrors.set(result));
});
