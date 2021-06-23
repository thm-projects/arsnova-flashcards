import "./learningStatus.html";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {LearningStatus} from "../../../../util/learningStatus";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Session} from "meteor/session";
import {LeitnerLearningWorkloadUtilities} from "../../../../util/learningWorkload";

Template.cardSidebarItemLearningStatus.helpers({
	isActive: function () {
		return Session.get("learningStatusModalActive");
	}
});

Template.cardSidebarItemLearningStatus.events({
	'click .showLearningStatus': function () {
		let workload = LeitnerLearningWorkloadUtilities.getActiveWorkload(FlowRouter.getParam('_id'));
		if (workload !== undefined) {
			LearningStatus.setupTempData(FlowRouter.getParam('_id'), Meteor.userId(), workload._id, 'cardset');
			Meteor.call('getLastLearningStatusActivity', Meteor.userId(), FlowRouter.getParam('_id'), workload._id, false, function (err, res) {
				if (res) {
					Session.set('lastLearningStatusActivity', res);
				}
			});
			$('#learningStatusModal').modal('show');
		}
	}
});
