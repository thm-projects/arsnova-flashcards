import "./leitnerHistory.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LeitnerHistoryUtilities} from "../../../../util/learningHistory";

Template.cardSidebarItemLearningHistory.helpers({
	isActive: function () {
		return Session.get('learningHistoryModalActive');
	}
});

Template.cardSidebarItemLearningHistory.events({
	"click .showLearningHistory": function (event) {
		$('#learningHistoryModal').modal('show');
		let workload_id = $(event.target).data('workloadId');
		if (workload_id !== undefined) {
			Meteor.call("getLearningHistory", Meteor.userId(), FlowRouter.getParam('_id'), workload_id, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for history');
				}
				if (result) {
					Session.set('selectedLearningHistory', LeitnerHistoryUtilities.prepareUserHistoryData(result));
				}
			});
		}
	}
});
