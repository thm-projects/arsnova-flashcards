//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Workload} from "../../../../api/learned";
import {CardsetNavigation} from "../../../../api/cardsetNavigation";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import "./learning.html";

/*
 * ############################################################################
 * cardsetNavigationLearning
 * ############################################################################
 */

Template.cardsetNavigationLearning.helpers({
	notEmpty: function () {
		let workload = Workload.findOne({cardset_id: Session.get('activeCardset')._id, user_id: Meteor.userId()});
		return workload.leitner.activeCount;
	}
});

Template.cardsetNavigationLearning.events({
	"click #learnBoxActive": function () {
		Router.go('box', {
			_id: Router.current().params._id
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
			let workload = Workload.findOne({cardset_id: Session.get('activeCardset')._id, user_id: Meteor.userId()});
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
