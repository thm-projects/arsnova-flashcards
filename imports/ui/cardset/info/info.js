//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Leitner, Wozniak} from "../../../api/learned";
import ResizeSensor from "../../../../client/resize_sensor/ResizeSensor";
import {CardsetVisuals} from "../../../api/cardsetVisuals";
import {Bonus} from "../../../api/bonus";
import {CardNavigation} from "../../../api/cardNavigation";
import "../navigation/navigation.js";
import "./box/cardset.js";
import "./box/bonus.js";
import "./info.html";

/*
 * ############################################################################
 * cardsetInfo
 * ############################################################################
 */

Template.cardsetInfo.onCreated(function () {
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});
});

Template.cardsetInfo.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});
	new ResizeSensor($('#cardsetInfoDetail'), function () {
		CardsetVisuals.resizeCardsetInfo();
	});
	CardsetVisuals.resizeCardsetInfo();
});

Template.cardsetInfo.helpers({
	isLecturerAndHasRequest: function () {
		return (Roles.userIsInRole(Meteor.userId(), 'lecturer') && this.request === true && this.owner !== Meteor.userId());
	},
	learning: function () {
		return (Leitner.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId()
		}) || Wozniak.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			interval: {$ne: 0}
		}));
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardsetInfo.events({
	"click #collapseManageButton": function () {
		CardsetVisuals.changeCollapseIcon("#collapseMangeIcon");
	},
	'click a': function (evt) {
		CardNavigation.linkNavigation(evt);
	}
});
