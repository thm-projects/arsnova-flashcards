//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../api/cardsets";
import {Notifications} from "../../../api/notifications";
import "./notifications.html";

/*
 * ############################################################################
 * profileNotifications
 * ############################################################################
 */

Template.profileNotifications.events({
	"click #clearBtn": function () {
		var notifications = Notifications.find({target_type: 'user', target: Meteor.userId()});
		notifications.forEach(function (notification) {
			Meteor.call("deleteNotification", notification);
		});
	},
	"click #deleteNotificationBtn": function () {
		Meteor.call("deleteNotification", this._id);
	}
});

Template.profileNotifications.helpers({
	getNotifications: function () {
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
			return Notifications.find({}, {sort: {date: -1}});
		} else {
			return Notifications.find({target_type: 'user', target: Meteor.userId()}, {sort: {date: -1}});
		}
	},
	getLink: function () {
		return "/cardset/" + this.link_id;
	},
	getStatus: function () {
		if (this.type === 'Kartensatz-Freigabe') {
			var cardset = Cardsets.findOne(this.link_id);
			return (cardset.visible === true) ? TAPi18n.__('notifications.approved') : TAPi18n.__('notifications.pending');
		} else {
			return TAPi18n.__('notifications.progress');
		}
	}
});
