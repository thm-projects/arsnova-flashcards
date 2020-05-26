import "./logout.html";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

/*
* ############################################################################
* mainNavigationTopItemProfileItemLogout
* ############################################################################
*/

Template.mainNavigationTopItemProfileItemLogout.events({
	'click .logout-dropdown': function () {
		FlowRouter.go('home');
		Meteor.logout();
	}
});




