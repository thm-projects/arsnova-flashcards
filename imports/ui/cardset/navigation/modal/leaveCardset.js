//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./leaveCardset.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * leaveCardsetForm
 * ############################################################################
 */

Template.leaveCardsetForm.events({
	'click #leaveCardsetConfirm': function () {
		var id = FlowRouter.getParam('_id');


		$('#leaveCardsetModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#leaveCardsetModal').on('hidden.bs.modal', function () {
			Meteor.call("disableLeitner", id);
			Meteor.call("deleteWozniak", id);
			FlowRouter.go('home');
		});
	}
});
