import {Route} from "../../../../api/route";
import "./backToHome.html";

/*
 * ############################################################################
 * impressumNavigationItemBackToHome
 * ############################################################################
 */

Template.impressumNavigationItemBackToHome.events({
	'click #backToStartButton': function (event) {
		event.preventDefault();
		Route.setFirstTimeVisit();
		Router.go('home');
	}
});
