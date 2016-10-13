//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./first_login.html";

/**
 * ############################################################################
 * first_login_content_only
 * ############################################################################
 */

Template.first_login_content_only.events({
	'click #logout_first_login': function (event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('home');
	},
	'click #accept_checkbox': function () {
	  if ($("#accept_checkbox").prop('checked') === true) {
      $('#accept_button').removeAttr('disabled');
    } else {
			$('#accept_button').attr('disabled', 'disabled');
    }
	},
	'click #accept_button': function () {
		Meteor.call('removeFirstLogin');
		document.location.reload(true);
	},
	'click #logout_first_login': function () {
		Meteor.call('deleteUserProfile');
		document.location.reload(true);
	}
});
