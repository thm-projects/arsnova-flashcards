//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Leitner} from "../../../api/subscriptions/leitner";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import ResizeSensor from "../../../../client/thirdParty/resizeSensor/ResizeSensor";
import {CardsetVisuals} from "../../../util/cardsetVisuals";
import {Bonus} from "../../../util/bonus";
import {MarkdeepContent} from "../../../util/markdeep";
import "../navigation/navigation.js";
import "./box/cardset.js";
import "./box/bonus.js";
import "./box/bonusTranscript.js";
import "./info.html";
import {ServerStyle} from "../../../util/styles";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
	new ResizeSensor($('#navbar-cards-top'), function () {
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
			cardset_id: FlowRouter.getParam('_id'),
			user_id: Meteor.userId()
		}) || Wozniak.findOne({
			cardset_id: FlowRouter.getParam('_id'),
			user_id: Meteor.userId(),
			interval: {$ne: 0}
		}));
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	},
	canSeeBonusDropdown: function () {
		return this.learningActive && ServerStyle.gotNavigationFeature("misc.features.bonus");
	},
	canSeeBonusTranscriptDropdown: function () {
		return this.transcriptBonus !== undefined && this.transcriptBonus.enabled && ServerStyle.gotNavigationFeature("misc.features.bonus");
	}
});

Template.cardsetInfo.events({
	'click a': function (event) {
		MarkdeepContent.getLinkTarget(event);
	}
});
