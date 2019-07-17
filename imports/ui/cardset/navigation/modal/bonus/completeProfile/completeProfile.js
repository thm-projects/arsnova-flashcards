import "./completeProfile.html";
import {Meteor} from "meteor/meteor";

/*
 * ############################################################################
 * profileIncompleteModal
 * ############################################################################
 */

Template.profileIncompleteModal.events({
	'click #completeProfileGoToProfile': function () {
		$('#profileIncompleteModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		Router.go('profileSettings', {
			_id: Meteor.userId()
		});
	},
	'click #completeProfileCancel': function () {
		$('#profileIncompleteModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
