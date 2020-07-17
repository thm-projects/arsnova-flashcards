import "./leitnerGraph.html";
import {Template} from "meteor/templating";
import {LeitnerProgress} from "../../../../util/leitnerProgress";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Session} from "meteor/session";

Template.cardSidebarItemLeitnerGraph.helpers({
	isActive: function () {
		return Session.get("progressModalActive");
	}
});

Template.cardSidebarItemLeitnerGraph.events({
	'click .showLeitnerGraph': function () {
		LeitnerProgress.setupTempData(FlowRouter.getParam('_id'), Meteor.userId(), 'cardset');
		$('#progressModal').modal('show');
	}
});
