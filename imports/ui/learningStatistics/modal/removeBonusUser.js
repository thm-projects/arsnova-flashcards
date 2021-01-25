//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./removeBonusUser.html";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../util/bertAlertVisuals";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
	}
});

Template.learningStatisticsRemoveBonusUserModal.events({
	"click #removeUserFromBonusConfirm": function () {
		if (Session.get('selectedBonusUser') !== undefined) {
			Meteor.call('removeUserFromBonus', FlowRouter.getParam('_id'), Session.get('selectedLearningStatisticsUser').user_id, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
				}
				if (result) {
					Session.set("selectedLearningStatistics", result);
					BertAlertVisuals.displayBertAlert(TAPi18n.__('learningStatistics.bertAlert.userRemoved'), 'success', 'growl-top-left');
				}
			});
			$('#learningStatisticsRemoveBonusUserModal').modal("hide");
		}
	}
});
