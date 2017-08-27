//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";

/*
 * ############################################################################
 * contact
 * ############################################################################
 */

Template.contact.events({
	'click #back-button': function () {
		Router.go('home');
	}
});

