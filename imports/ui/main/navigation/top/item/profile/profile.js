import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Notifications} from "../../../../../../api/subscriptions/notifications";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./item/billing.js";
import "./item/logout.js";
import "./item/membership.js";
import "./item/overview.js";
import "./item/requests.js";
import "./item/settings.js";
import "./profile.html";

/*
* ############################################################################
* mainNavigationTopItemProfile
* ############################################################################
*/

Template.mainNavigationTopItemProfile.helpers({
	isActiveProfile: function () {
		if (FlowRouter.getRouteName() === 'profile') {
			return FlowRouter.getParam('_id') === Meteor.userId();
		}
		return false;
	},
	countNotifications: function () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
			return Notifications.find({}).count();
		} else {
			return Notifications.find({read: false, target_type: 'stats.js', target: Meteor.userId()}).count();
		}
	}
});
