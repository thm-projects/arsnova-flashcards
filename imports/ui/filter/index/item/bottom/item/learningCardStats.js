import "./learningCardStats.html";
import {Meteor} from "meteor/meteor";
import {LeitnerLearningWorkloadUtilities} from "../../../../../../util/learningWorkload";
import {Session} from "meteor/session";
import {LeitnerHistoryUtilities} from "../../../../../../util/learningHistory";

Template.filterIndexItemBottomLearningCardStats.events({
	'click .showLearningCardStats': function (event) {
		let workload = LeitnerLearningWorkloadUtilities.getActiveWorkload($(event.currentTarget).data('cardset'), $(event.currentTarget).data('user'));
		if (workload !== undefined) {
			Session.set('workloadProgressCardsetID', workload.cardset_id);
			Meteor.call("getLearningCardStats", Meteor.userId(), workload.cardset_id, workload.learning_phase_id, function (error, result) {
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
