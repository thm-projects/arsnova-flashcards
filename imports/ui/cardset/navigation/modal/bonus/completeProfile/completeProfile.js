import "./completeProfile.html";
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
		FlowRouter.go('profileSettings', {
			_id: Meteor.userId()
		});
	},
	'click #completeProfileCancel': function () {
		$('#profileIncompleteModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
