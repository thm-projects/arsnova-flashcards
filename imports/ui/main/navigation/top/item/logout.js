import "./logout.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
* ############################################################################
* mainNavigationTopItemLogout
* ############################################################################
*/

Template.mainNavigationTopItemLogout.events({
	'click #navbar-logout': function () {
		FlowRouter.go('home');
		Meteor.logout();
	}
});
