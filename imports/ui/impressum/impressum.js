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
	'click #backButton': function () {
		window.history.back();
	},
	'click #backToStartButton': function () {
		Router.go('home');
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
