//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./preview.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * cardsetPreview
 * ############################################################################
 */


Template.cardsetPreview.events({
	"click #buyProBtn": function () {
		FlowRouter.go('profileMembership', {
			_id: Meteor.userId()
		});
	},
	"click #showPreviewHelp": function () {
		event.stopPropagation();
		Session.set('helpFilter', "previewCardset");
		FlowRouter.go('help');
	}
});

Template.cardsetPreview.onDestroyed(function () {
	if (FlowRouter.getParam('_id')) {
		Meteor.subscribe('cardsetCards', FlowRouter.getParam('_id'));
		Session.set('activeCard', undefined);
	}
});
