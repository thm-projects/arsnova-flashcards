import "./preview.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

Session.setDefault('isStudentPreviewActive', false);

/*
 * ############################################################################
 * cardsetSidebarItemPreview
 * ############################################################################
 */

Template.cardsetSidebarItemPreview.onCreated(function () {
	Session.set('isStudentPreviewActive', false);
});

Template.cardsetSidebarItemPreview.onDestroyed(function () {
	Session.set('isStudentPreviewActive', false);
});

Template.cardsetSidebarItemPreview.helpers({
	isActive: function () {
		return Session.get('isStudentPreviewActive');
	}
});

Template.cardsetSidebarItemPreview.events({
	'click .preview': function () {
		if (Session.get('isStudentPreviewActive') === true) {
			Session.set('isStudentPreviewActive', false);
		} else {
			Session.set('isStudentPreviewActive', true);
		}
	}
});
