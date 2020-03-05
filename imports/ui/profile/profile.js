//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./view/billing.js";
import "./view/membership.js";
import "./view/notifications.js";
import "./view/requests.js";
import "./view/settings.js";
import "./view/leitnerProgress.js";
import "./view/public.js";
import "./view/overview.js";
import "./modal/deleteProfile.js";
import "./profile.html";

Meteor.subscribe("notifications");
Meteor.subscribe("colorThemes");
Meteor.subscribe('defaultAppData', function () {
	Session.set('data_loaded', true);
});

Template.registerHelper("getUser", function () {
	var user = Meteor.users.findOne(Router.current().params._id);
	Session.set("stats.js", user);
	return user;
});
Template.registerHelper("isUser", function () {
	return Router.current().params._id === Meteor.userId();
});

/*
 * ############################################################################
 * profile
 * ############################################################################
 */

Template.profile.helpers({
	isVisible: function () {
		var userId = Router.current().params._id;
		if (userId !== undefined) {
			var user = Meteor.users.findOne(userId);
			if (user !== undefined) {
				return userId === Meteor.userId() || user.visible;
			}
		}
		return null;
	}
});
