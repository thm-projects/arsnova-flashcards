//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Route} from "../../api/route.js";
import "./impressum.html";
import "../card/modal/demo.js";
import "./modal/statistics/statistics.js";
import "./pages/about/about.js";
import "./pages/agb/agb.js";
import "./pages/datenschutz/datenschutz.js";
import "./pages/demo/demo.js";
import "./pages/faq/faq.js";
import "./pages/learning/learning.js";
import "./pages/support/support.js";

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
