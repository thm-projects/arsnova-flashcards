//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./removeBonusUser.html";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../util/bertAlertVisuals";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {LeitnerHistoryUtilities} from "../../../util/learningHistory";

Template.learningStatisticsRemoveBonusUserModal.onCreated(function () {
	$('#learningStatisticsRemoveBonusUserModal').on('hidden.bs.modal', function () {
		Session.set('selectedLearningStatisticsUser', undefined);
	});
});

Template.learningStatisticsRemoveBonusUserModal.helpers({
	gotHiddenUserNames: function () {
		return Session.get('hideUserNames');
	},
	userData: function () {
		return Session.get('selectedLearningStatisticsUser');
	},
	getPercentage: function () {
		if (this.percentage > 0) {
			return '<span class="cardPercentage">[' + this.percentage + ' %]</span>';
		}
	},
	earnedTrophy: function () {
		return this.percentage >= Session.get('activeCardset').workload.bonus.minLearned;
	}
});

Template.learningStatisticsRemoveBonusUserModal.events({
	"click #removeUserFromBonusConfirm": function () {
		if (Session.get('selectedLearningStatisticsUser') !== undefined) {
			Meteor.call('removeUserFromBonus', FlowRouter.getParam('_id'), Session.get('selectedLearningStatisticsUser').user_id, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
				}
				if (result) {
					//Flush the list before refilling it
					Session.set("selectedLearningStatistics", []);
					setTimeout(function () {
						Session.set("selectedLearningStatistics", LeitnerHistoryUtilities.prepareBonusUserData(result));
					}, 250);
					BertAlertVisuals.displayBertAlert(TAPi18n.__('learningStatistics.bertAlert.userRemoved'), 'success', 'growl-top-left');
				}
			});
			$('#learningStatisticsRemoveBonusUserModal').modal("hide");
		}
	}
});
