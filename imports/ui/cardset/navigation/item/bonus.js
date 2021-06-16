//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {CardType} from "../../../../util/cardTypes";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {BertAlertVisuals} from "../../../../util/bertAlertVisuals";
import "../modal/endBonus.js";
import "../modal/bonus/simulator/leitnerSimulator.js";
import "./bonus.html";

/*
 * ############################################################################
 * cardsetNavigationBonus
 * ############################################################################
 */

Template.cardsetNavigationBonus.helpers({
	enableIfPublished: function () {
		return this.kind !== 'personal';
	},
	gotLearningModes: function () {
		if (this.shuffled) {
			for (let i = 0; i < this.cardGroups.length; i++) {
				if (CardType.gotLearningModes(Cardsets.findOne(this.cardGroups[i]).cardType)) {
					return true;
				}
			}
		} else {
			return CardType.gotLearningModes(this.cardType);
		}
	}
});

Template.cardsetNavigationBonus.events({
	"click .bonusBtn": function () {
		if (this.kind === "personal") {
			let cardCount;
			if (this.shuffled) {
				cardCount = 2;
			} else {
				cardCount = 1;
			}
			let cardCountMessage = TAPi18n.__('confirmLearn-form.card', {count: cardCount});
			Bert.defaults.hideDelay = 10000;
			BertAlertVisuals.displayBertAlert(TAPi18n.__('bertAlert.publishBonus.message', {cardcount: cardCountMessage, edu: Meteor.settings.public.university.default}), 'warning', 'growl-top-left');
		}
	},
	"click #startBonus": function () {
		Session.set('displayContentOfNewLearningPhaseBonus', true);
		$('#bonusFormModal').modal('show');
	},
	"click #manageBonus": function () {
		Session.set('displayContentOfNewLearningPhaseBonus', false);
		$('#bonusFormModal').modal('show');
	},
	"click #showStats": function () {
		FlowRouter.go('cardsetstats', {_id: FlowRouter.getParam('_id')});
	},
	"click #transcriptBonus": function () {
		FlowRouter.go('transcriptBonus', {_id: FlowRouter.getParam('_id')});
	}
});
