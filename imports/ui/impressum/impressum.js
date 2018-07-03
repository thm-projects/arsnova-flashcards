//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";
import {Session} from "meteor/session";
import {Route} from "../../api/route.js";

/*
 * ############################################################################
 * contact
 * ############################################################################
 */


Template.contact.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});

Template.contact.events({
	'click #backButton': function () {
		window.history.back();
	}
});

Template.contact.onCreated(function () {
	this.subscribe("cardsets");
	this.subscribe("cards");
});

/*
 * ############################################################################
 * contactNavigation
 * ############################################################################
 */

Template.contactNavigation.events({
	'click #backToStartButton': function (event) {
		event.preventDefault();
		Route.setFirstTimeVisit();
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

/*
 * ############################################################################
 * demo
 * ############################################################################
 */

Template.demo.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});
