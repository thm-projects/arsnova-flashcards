import "./logout.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Fullscreen} from "../../../../../util/fullscreen";

/*
* ############################################################################
* mainNavigationTopItemLogout
* ############################################################################
*/

Template.mainNavigationTopItemLogout.events({
	'click #navbar-logout': function () {
		Fullscreen.resetChooseModeSessions();
		FlowRouter.go('home');
		Meteor.logout();
	}
});
