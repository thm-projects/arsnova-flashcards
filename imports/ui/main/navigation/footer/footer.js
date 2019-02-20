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

/*
 * ############################################################################
 * mainNavigationFooter
 * ############################################################################
 */

Template.mainNavigationFooter.helpers({
	displayWelcomeNavigation: function () {
		return (Route.isHome());
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
	MainNavigation.repositionCollapseElements();
});
