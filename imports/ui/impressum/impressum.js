//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Route} from "../../api/route.js";
import "./impressum.html";
import "../card/modal/demo.js";
import "./modal/statistics/statistics.js";
import "./navigation/navigation.js";

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
 * demo
 * ############################################################################
 */

Template.demo.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});
