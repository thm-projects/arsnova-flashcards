import {Route} from "../../../../../api/route";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./backToHome.html";

/*
 * ############################################################################
 * mainNavigationFooterItemBackToHome
 * ############################################################################
 */

Template.mainNavigationFooterItemBackToHome.events({
	'click #backToStartButton': function (event) {
		event.preventDefault();
		Route.setFirstTimeVisit();
		FlowRouter.go('home');
	}
});
