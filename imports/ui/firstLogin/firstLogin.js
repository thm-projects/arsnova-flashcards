//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
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
		localStorage.setItem("displayedFirstLoginBertAlert", "true");
		Router.go('pool');
		window.scrollTo(0, 0);
	},
	'click #cancelFirstLogin': function () {
		Meteor.call("deleteUserProfile");
		document.location.reload(true);
	}
});
