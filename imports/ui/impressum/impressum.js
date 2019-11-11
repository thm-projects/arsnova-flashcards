//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Route} from "../../api/route.js";
import "./impressum.html";
import "../card/modal/demo.js";
import "./modal/statistics/statistics.js";
import "./pages/cards/about/about.js";
import "./pages/cards/agb/agb.js";
import "./pages/cards/datenschutz/datenschutz.js";
import "./pages/cards/faq/faq.js";
import "./pages/cards/support/support.js";
import "./pages/linux/about/about.js";
import "./pages/linux/agb/agb.js";
import "./pages/linux/datenschutz/datenschutz.js";
import "./pages/linux/faq/faq.js";
import "./pages/linux/support/support.js";
import "./pages/demo/demo.js";
import "./pages/learning/learning.js";

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
