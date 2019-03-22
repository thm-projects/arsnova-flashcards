//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./accessDenied.html";

Meteor.subscribe("notifications");

/*
 * ############################################################################
 * accessDenied
 * ############################################################################
 */

Template.accessDenied.events({
	'click #logout_access_denied_blocked': function (event) {
		event.preventDefault();
		Router.go('home');
	}
});
