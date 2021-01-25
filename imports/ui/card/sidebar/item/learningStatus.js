import "./learningStatus.html";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {LearningStatus} from "../../../../util/learningStatus";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Session} from "meteor/session";

Template.cardSidebarItemLearningStatus.helpers({
	isActive: function () {
		return Session.get("learningStatusModalActive");
	}
});

Template.cardSidebarItemLearningStatus.events({
	'click .showLearningStatus': function () {
		LearningStatus.setupTempData(FlowRouter.getParam('_id'), Meteor.userId(), 'cardset');
		Meteor.call('getLastLearningStatusActivity', Meteor.userId(), FlowRouter.getParam('_id'), function (err, res) {
			if (res) {
				Session.set('lastLearningStatusActivity', res);
			}
		});
		$('#learningStatusModal').modal('show');
	}
});
