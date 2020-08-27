import "./logout.html";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Fullscreen} from "../../../../../../../util/fullscreen";

/*
* ############################################################################
* mainNavigationTopItemProfileItemLogout
* ############################################################################
*/

Template.mainNavigationTopItemProfileItemLogout.events({
	'click .logout-dropdown': function () {
		Fullscreen.resetChooseModeSessions();
		FlowRouter.go('home');
		Meteor.logout();
	}
});




