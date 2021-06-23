import "./learningStatus.html";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {LearningStatus} from "../../../../../../util/learningStatus";

import {Session} from "meteor/session";
import {LeitnerLearningWorkloadUtilities} from "../../../../../../util/learningWorkload";

Template.filterIndexItemBottomLearningStatus.events({
	'click .showLearningStatus': function (event) {
		let workload = LeitnerLearningWorkloadUtilities.getActiveWorkload($(event.currentTarget).data('cardset'), $(event.currentTarget).data('user'));
		if (workload !== undefined) {
			LearningStatus.setupTempData($(event.currentTarget).data('cardset'), ($(event.currentTarget).data('user')), workload._id, 'cardset');
			Meteor.call('getLastLearningStatusActivity', $(event.currentTarget).data('user'), $(event.currentTarget).data('cardset'), workload._id, false, function (err, res) {
				if (res) {
					Session.set('lastLearningStatusActivity', res);
				}
			});
			$('#learningStatusModal').modal('show');
		}
	}
});
