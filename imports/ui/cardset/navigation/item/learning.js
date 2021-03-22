//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {LeitnerLearningWorkload} from "../../../../api/subscriptions/leitner/leitnerLearningWorkload";
import {CardsetNavigation} from "../../../../util/cardsetNavigation";
import {BertAlertVisuals} from "../../../../util/bertAlertVisuals";
import "./learning.html";

/*
 * ############################################################################
 * cardsetNavigationLearning
 * ############################################################################
 */

Template.cardsetNavigationLearning.helpers({
	notEmpty: function () {
		let workload = LeitnerLearningWorkload.findOne({cardset_id: Session.get('activeCardset')._id, user_id: Meteor.userId()});
		return workload.leitner.activeCount;
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
		if (Session.get('activeCardset').learningEnd.getTime() > new Date().getTime()) {
			let workload = LeitnerLearningWorkload.findOne({cardset_id: Session.get('activeCardset')._id, user_id: Meteor.userId()});
			let text = "";
			if (workload.leitner.activeCount) {
				let deadline = new Date(workload.leitner.activeDate.getTime() + Session.get('activeCardset').daysBeforeReset * 86400000);
				if (deadline.getTime() > Session.get('activeCardset').learningEnd.getTime()) {
					text += (TAPi18n.__('deadlinePrologue') + moment(Session.get('activeCardset').learningEnd).format("DD.MM.YYYY") + TAPi18n.__('deadlineEpilogue1'));
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
