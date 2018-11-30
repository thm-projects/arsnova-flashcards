//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";
import "../card/modal/demo.js";
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
});

/*
 * ############################################################################
 * contactNavigation
 * ############################################################################
 */

Template.contactNavigation.helpers({
	displayAsFooter: function () {
		return (Route.isHome() || Route.isFirstTimeVisit() || Route.isMakingOf());
	}
});

Template.contactNavigation.events({
	'click a': function () {
		window.scrollTo(0, 0);
	},
	'click #backToStartButton': function (event) {
		event.preventDefault();
		Route.setFirstTimeVisit();
		Router.go('home');
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
