//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./preview.html";

/*
 * ############################################################################
 * cardsetPreview
 * ############################################################################
 */


Template.cardsetPreview.events({
	"click #buyProBtn": function () {
		Router.go('profileMembership', {
			_id: Meteor.userId()
		});
	},
	"click #showPreviewHelp": function () {
		event.stopPropagation();
		Session.set('helpFilter', "previewCardset");
		Router.go('help');
	}
});

Template.cardsetPreview.onDestroyed(function () {
	if (Router.current().params._id) {
		Meteor.subscribe('cardsetCards', Router.current().params._id);
		Session.set('activeCard', undefined);
	}
});
