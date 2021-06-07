import "./deleteArchivedBonus.html";
import {LeitnerLearningPhase} from "../../../api/subscriptions/leitner/leitnerLearningPhase";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Utilities} from "../../../util/utilities";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import RouteName from "../../../util/routeNames";
import {LeitnerLearningPhaseUtilities} from "../../../util/learningPhase";
import {LeitnerHistoryUtilities} from "../../../util/learningHistory";

Template.learningStatisticsDeleteArchivedBonusModal.helpers({
	getBonusName: function () {
		let learningPhase = LeitnerLearningPhase.findOne({_id: Session.get('selectedLearningPhaseID')});
		return TAPi18n.__("learningStatisticsDeleteArchivedBonus.title", {name: Utilities.getMomentsDate(learningPhase.createdAt, false, 0, false)});
	}
});

Template.learningStatisticsDeleteArchivedBonusModal.events({
	"click #deleteArchivedBonusConfirm": function () {
		Meteor.call("deleteArchivedBonus", Session.get('selectedLearningPhaseID'), function (error, res) {
			if (!error) {
				$('#learningStatisticsDeleteArchivedBonusModal').modal("hide");
				$('#bonusFormModal').modal("hide");
				$('.modal-backdrop').remove();
				Session.set("selectedLearningStatistics", []);
				Session.set('displayContentOfNewLearningPhaseBonus', true);
				if (res > 0) {
					Session.set('selectedLearningPhaseID', LeitnerLearningPhaseUtilities.getNewestBonus(FlowRouter.getParam('_id'))._id);
					Meteor.call("getLearningStatistics", FlowRouter.getParam('_id'), Session.get('selectedLearningPhaseID'), function (error, result) {
						if (error) {
							throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
						}
						if (result) {
							Session.set("selectedLearningStatistics", LeitnerHistoryUtilities.prepareBonusUserData(result));
						}
					});
				} else {
					FlowRouter.go(RouteName.cardsetdetailsid, {
						_id: FlowRouter.getParam('_id')
					});
				}
			}
		});
	}
});
