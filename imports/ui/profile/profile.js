//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./profile.html";

Meteor.subscribe("notifications");
Meteor.subscribe("colorThemes");
Meteor.subscribe('defaultAppData', function () {
	Session.set('data_loaded', true);
});

Template.registerHelper("getUser", function () {
	var user = Meteor.users.findOne(FlowRouter.getParam('_id'));
	Session.set("stats.js", user);
	return user;
});
Template.registerHelper("isUser", function () {
	return FlowRouter.getParam('_id') === Meteor.userId();
});

/*
 * ############################################################################
 * profile
 * ############################################################################
 */

Template.profile.helpers({
	isVisible: function () {
		var userId = FlowRouter.getParam('_id');
		if (userId !== undefined) {
			var user = Meteor.users.findOne(userId);
			if (user !== undefined) {
				return userId === Meteor.userId() || user.visible;
			}
		}
		return null;
	}
});
