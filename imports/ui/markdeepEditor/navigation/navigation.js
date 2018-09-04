import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {MarkdeepEditor} from "../../../api/markdeepEditor.js";
import "./navigation.html";
import {CardVisuals} from "../../../api/cardVisuals";

/*
 * ############################################################################
 * markdeepNavigation
 * ############################################################################
 */
Template.markdeepNavigation.events({
	'click .markdeep-help': function () {
		MarkdeepEditor.help();
	},
	'click .markdeep-mobile-preview': function () {
		MarkdeepEditor.changeMobilePreview();
	},
	'click .markdeep-rotate-mobile-preview': function () {
		MarkdeepEditor.changeMobilePreviewRotation();
	},
	'click .markdeep-center': function () {
		MarkdeepEditor.center();
	},
	'click .markdeep-background-style': function () {
		MarkdeepEditor.changeBackgroundStyle();
	},
	'click .markdeep-fullscreen': function () {
		MarkdeepEditor.toggleFullscreen();
	}
});

Template.markdeepNavigation.helpers({
	isMobilePreviewActive: function () {
		return Session.get('mobilePreview');
	},
	isMobilePreviewRotated: function () {
		return Session.get('mobilePreviewRotated');
	},
	isCenterTextActive: function () {
		return CardVisuals.isCentered(Session.get('activeCardContentId'), true);
	},
	isAlternativeBackgroundStyle: function () {
		return Session.get('backgroundStyle');
	},
	isFullscreenActive: function () {
		return Session.get('fullscreen');
	}
});
