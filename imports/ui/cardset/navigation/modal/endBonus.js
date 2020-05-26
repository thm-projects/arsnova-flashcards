//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import "./endBonus.html";

/*
 * ############################################################################
 * cardsetEndLearnForm
 * ############################################################################
 */

Template.cardsetEndLearnForm.events({
	"click #confirmEndLearn": function () {
		if (Cardsets.findOne(FlowRouter.getParam('_id')).learningActive) {
			Meteor.call("deactivateBonus", FlowRouter.getParam('_id'));
		}
		$('#confirmEndLearnModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
