//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./firstLogin.html";

/*
 * ############################################################################
 * firstLoginContent
 * ############################################################################
 */

Template.firstLoginContent.events({
	'click #acceptFirstLoginCheckbox': function () {
		if ($("#acceptFirstLoginCheckbox").prop('checked') === true) {
			$('#acceptFirstLogin').removeAttr('disabled');
		} else {
			$('#acceptFirstLogin').attr('disabled', 'disabled');
		}
	},
	'click #acceptFirstLogin': function () {
		Meteor.call('removeFirstLogin');
		FlowRouter.go('pool');
		window.scrollTo(0, 0);
	},
	'click #cancelFirstLogin': function () {
		Meteor.call("deleteUserProfile");
		document.location.reload(true);
	}
});
