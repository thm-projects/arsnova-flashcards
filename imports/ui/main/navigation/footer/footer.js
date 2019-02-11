import "./item/info.js";
import "./footer.html";
import {Template} from "meteor/templating";
import {Route} from "../../../../api/route";

/*
 * ############################################################################
 * mainNavigationFooter
 * ############################################################################
 */

Template.mainNavigationFooter.helpers({
	displayFooterNavigation: function () {
		return (Route.isHome() || (Route.isFirstTimeVisit() && Route.isDemo() || Route.isMakingOf()));
	}
});
