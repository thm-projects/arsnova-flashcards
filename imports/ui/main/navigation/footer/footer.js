import {Template} from "meteor/templating";
import {Route} from "../../../../api/route";
import "./item/info.js";
import "./item/about.js";
import "./item/agb.js";
import "./item/backToHome.js";
import "./item/datenschutz.js";
import "./item/demo.js";
import "./item/faq.js";
import "./item/help.js";
import "./item/impressum.js";
import "./item/info.js";
import "./item/learning.js";
import "./item/statistics.js";
import "./footer.html";
import {MainNavigation} from "../../../../api/mainNavigation";
import {Meteor} from "meteor/meteor";
import ResizeSensor from "../../../../../client/thirdParty/resizeSensor/ResizeSensor";

/*
 * ############################################################################
 * mainNavigationFooter
 * ############################################################################
 */

Template.mainNavigationFooter.helpers({
	canDisplayFooter: function () {
		return Route.isImpressum() || (Route.isHome() && (!Meteor.user() && !MainNavigation.isGuestLoginActive()));
	}
});

Template.mainNavigationFooter.events({
	'click .toggle-navbar-collapse': function (event) {
		event.preventDefault();
		$('#navbar-cards-footer-collapse').collapse('toggle');
	}
});

/*
 * ############################################################################
 * mainNavigationFooterDropdownContent
 * ############################################################################
 */

Template.mainNavigationFooterDropdownContent.onRendered(function () {
	new ResizeSensor($('#navbar-cards-footer'), function () {
		MainNavigation.repositionCollapseElements();
	});
	MainNavigation.repositionCollapseElements();
});
