import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Notifications} from "../../../../../../api/notifications";
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
		if (ActiveRoute.name(/^profile/)) {
			return Router.current().params._id === Meteor.userId();
		}
		return false;
	},
	countNotifications: function () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
			return Notifications.find({}).count();
		} else {
			return Notifications.find({read: false, target_type: 'user', target: Meteor.userId()}).count();
		}
	}
});
