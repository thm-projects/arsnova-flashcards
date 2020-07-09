import {Route} from "../../../../../api/route";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./backToHome.html";
import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";

/*
 * ############################################################################
 * mainNavigationFooterItemBackToHome
 * ############################################################################
 */

Template.mainNavigationFooterItemBackToHome.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});

Template.mainNavigationFooterItemBackToHome.events({
	'click #backToStartButton': function (event) {
		event.preventDefault();
		Route.setFirstTimeVisit();
		FlowRouter.go('home');
	}
});
