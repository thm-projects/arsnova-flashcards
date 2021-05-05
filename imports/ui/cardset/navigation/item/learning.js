//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {CardsetNavigation} from "../../../../util/cardsetNavigation";
import {BertAlertVisuals} from "../../../../util/bertAlertVisuals";
import "./learning.html";
import {LeitnerLearningWorkloadUtilities} from "../../../../util/learningWorkload";
import {LeitnerLearningPhaseUtilities} from "../../../../util/learningPhase";

/*
 * ############################################################################
 * cardsetNavigationLearning
 * ############################################################################
 */

Template.cardsetNavigationLearning.helpers({
	notEmpty: function () {
		let activeWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(Session.get('activeCardset')._id, Meteor.userId());
		if (activeWorkload !== undefined) {
			return activeWorkload.activeCardCount;
		}
	}
});

Template.cardsetNavigationLearning.events({
	"click #learnBoxActive": function () {
		FlowRouter.go('box', {
			_id: FlowRouter.getParam('_id')
		});
	}
});

Template.cardsetNavigationLearning.onCreated(function () {
	CardsetNavigation.addToLeitner(Session.get('activeCardset')._id);
});

Template.cardsetNavigationLearning.onRendered(function () {
	setTimeout(function () {
		Bert.defaults.hideDelay = 10000;
		let bertType = "success";
		let activeWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(Session.get('activeCardset')._id, Meteor.userId());
		let activeLearningPhase = LeitnerLearningPhaseUtilities.getActiveLearningPhase(undefined, undefined, activeWorkload.learning_phase_id);
		if (activeLearningPhase.end.getTime() > new Date().getTime()) {
			let text = "";
			if (activeWorkload.activeCardCount) {
				let deadline = new Date(activeWorkload.activationDate.getTime() + activeLearningPhase.daysBeforeReset * 86400000);
				if (deadline.getTime() > activeLearningPhase.end.getTime()) {
					text += (TAPi18n.__('deadlinePrologue') + moment(activeLearningPhase.end).format("DD.MM.YYYY") + TAPi18n.__('deadlineEpilogue1'));
				} else {
					text += (TAPi18n.__('deadlinePrologue') + moment(deadline).format("DD.MM.YYYY") + TAPi18n.__('deadlineEpilogue2'));
				}
				bertType = "warning";
				BertAlertVisuals.displayBertAlert(text, bertType, 'growl-top-left');
			}
		}
		Bert.defaults.hideDelay = 10000;
	}, 1000);
});
