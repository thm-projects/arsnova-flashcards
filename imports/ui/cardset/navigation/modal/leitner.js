//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./leitner.html";

/*
 * ############################################################################
 * resetLeitnerForm
 * ############################################################################
 */
Template.resetLeitnerForm.events({
	"click #resetLeitnerConfirm": function () {
		$('#resetLeitnerModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", Router.current().params._id);
		}).modal('hide');
	}
});
