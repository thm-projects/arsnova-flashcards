//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./editors.html";

/*
 * ############################################################################
 * leaveEditorsForm
 * ############################################################################
 */

Template.leaveEditorsForm.events({
	'click #leaveEditorsConfirm': function () {
		$('#leaveEditorsModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#leaveEditorsModal').on('hidden.bs.modal', function () {
			Meteor.call("leaveEditors", Router.current().params._id);
		});
	}
});
