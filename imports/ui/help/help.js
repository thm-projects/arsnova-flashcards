import {Session} from "meteor/session";
import "./content/de/helpContent.js";
import "./content/en/helpContent.js";
import "./modal/helpModal.js";
import "./help.html";

/*
 * ############################################################################
 * help
 * ############################################################################
 */

Template.help.helpers({
	isHelpFilterActive: function () {
		return Session.get('helpFilter') !== undefined;
	}
});

Template.help.events({
	'click #resethelpFilter': function () {
		Session.set('helpFilter', undefined);
	}
});
