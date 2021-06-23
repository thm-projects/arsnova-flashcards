import "./learningCardStats.html";
import {LeitnerLearningWorkloadUtilities} from "../../../../util/learningWorkload";
import {Session} from "meteor/session";
import {LeitnerHistoryUtilities} from "../../../../util/learningHistory";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

Template.cardSidebarItemLearningCardStats.events({
	'click .showLearningCardStats': function () {
		let workload = LeitnerLearningWorkloadUtilities.getActiveWorkload(FlowRouter.getParam('_id'));
		if (workload !== undefined) {
			Session.set('workloadProgressCardsetID', workload.cardset_id);
			Meteor.call("getLearningCardStats", Meteor.userId(), workload.cardset_id, workload.learning_phase_id, false, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for card stats');
				}
				if (result) {
					Session.set('selectedLearningCardStats', LeitnerHistoryUtilities.prepareCardStatsData(result));
				}
			});
			$('#learningCardStatusModal').modal('show');
		}
	}
});
