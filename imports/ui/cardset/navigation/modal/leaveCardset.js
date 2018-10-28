//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./leaveCardset.html";

/*
 * ############################################################################
 * leaveCardsetForm
 * ############################################################################
 */

Template.leaveCardsetForm.events({
	'click #leaveCardsetConfirm': function () {
		var id = Router.current().params._id;


		$('#leaveCardsetModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#leaveCardsetModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", id);
			Meteor.call("deleteWozniak", id);
			Router.go('home');
		});
	}
});
