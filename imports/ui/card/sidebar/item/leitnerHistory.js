import "./leitnerHistory.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LeitnerHistoryUtilities} from "../../../../util/leitnerHistory";

Template.cardSidebarItemLeitnerHistory.helpers({
	isActive: function () {
		return Session.get('bonusUserHistoryModalActive');
	}
});

Template.cardSidebarItemLeitnerHistory.events({
	"click .showLeitnerHistory": function () {
		$('#bonusUserHistoryModal').modal('show');
		Meteor.call("getLearningHistoryData", Meteor.userId(), FlowRouter.getParam('_id'), function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for history');
			}
			if (result) {
				Session.set('selectedBonusUserHistoryData', LeitnerHistoryUtilities.prepareUserHistoryData(result));
			}
		});
	}
});
