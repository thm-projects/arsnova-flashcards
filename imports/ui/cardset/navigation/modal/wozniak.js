//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./wozniak.html";

/*
 * ############################################################################
 * resetMemoForm
 * ############################################################################
 */
Template.resetMemoForm.events({
	"click #resetMemoConfirm": function () {
		$('#resetMemoModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteWozniak", Router.current().params._id);
		}).modal('hide');
	}
});
