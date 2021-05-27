import "./logout.html";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Fullscreen} from "../../../../../../../util/fullscreen";
import {Session} from "meteor/session";
import {ServerStyle} from "../../../../../../../util/styles";

/*
* ############################################################################
* mainNavigationTopItemProfileItemLogout
* ############################################################################
*/

Template.mainNavigationTopItemProfileItemLogout.events({
	'click .logout-dropdown': function () {
		Fullscreen.resetChooseModeSessions();
		Session.set("theme", ServerStyle.getDefaultThemeID());
		FlowRouter.go('home');
		Meteor.logout();
	}
});




