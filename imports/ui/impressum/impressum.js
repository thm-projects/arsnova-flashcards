//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * contact
 * ############################################################################
 */

Template.contact.events({
	'click #back-button': function () {
		window.history.back();
	}
});

/*
 * ############################################################################
 * help
 * ############################################################################
 */

Template.help.onRendered(function () {
	let target = Session.get('helpTarget');
	if (target !== undefined) {
		$(window).scrollTop(($(target).offset().top - 70));
		Session.set('helpTarget', undefined);
	}
});
