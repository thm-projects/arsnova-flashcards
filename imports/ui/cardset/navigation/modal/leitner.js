//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./leitner.html";

/*
 * ############################################################################
 * resetLeitnerForm
 * ############################################################################
 */
Template.resetLeitnerForm.events({
	"click #resetLeitnerConfirm": function () {
		$('#resetLeitnerModal').on('hidden.bs.modal', function () {
			Meteor.call("disableLeitner", FlowRouter.getParam('_id'));
		}).modal('hide');
	}
});
