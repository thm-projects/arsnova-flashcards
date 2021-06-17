import "./learningHistory.html";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {LeitnerHistoryUtilities} from "../../../../../../util/learningHistory";
import {LeitnerLearningWorkloadUtilities} from "../../../../../../util/learningWorkload";

Template.filterIndexItemBottomLearningHistory.events({
	"click .showLearningHistory": function (event) {
		let cardset_id = $(event.target).data('id');
		if (cardset_id !== undefined) {
			Meteor.call("getLearningHistory", Meteor.userId(), cardset_id, LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id)._id, function (error, result) {
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
