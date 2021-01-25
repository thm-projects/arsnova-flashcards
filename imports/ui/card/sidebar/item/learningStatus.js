import "./learningStatus.html";
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
		$('#learningStatusModal').modal('show');
	}
});
