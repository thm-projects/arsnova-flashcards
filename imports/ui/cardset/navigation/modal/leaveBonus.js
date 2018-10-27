//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./leaveBonus.html";

/*
 * ############################################################################
 * leaveLearnPhaseForm
 * ############################################################################
 */

Template.leaveLearnPhaseForm.events({
	'click #leaveLearnPhaseConfirm': function () {
		var id = Router.current().params._id;


		$('#leaveModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#leaveModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", id);
			Router.go('home');
		});
	}
});
