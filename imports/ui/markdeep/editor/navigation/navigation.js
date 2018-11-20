import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {MarkdeepEditor} from "../../../../api/markdeepEditor.js";
import {CardVisuals} from "../../../../api/cardVisuals";
import {Dictionary} from "../../../../api/dictionary";
import {CardType} from "../../../../api/cardTypes";
import "./navigation.html";

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
	'click .fa-align-left': function () {
		MarkdeepEditor.leftAlign();
	},
	'click .markdeep-background-style': function () {
		MarkdeepEditor.changeBackgroundStyle();
	},
	'click .markdeep-fullscreen': function () {
		MarkdeepEditor.toggleFullscreen();
	},
	'click .markdeep-translate': function () {
		Dictionary.setMode(2);
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
	isCenterTextAlignLeft: function () {
		return CardVisuals.isLeftAlign(Session.get('activeCardContentId'), true);
	},
	isAlternativeBackgroundStyle: function () {
		return Session.get('backgroundStyle');
	},
	isFullscreenActive: function () {
		return Session.get('fullscreen');
	},
	isTranslationActive: function () {
		return Dictionary.checkMode(2);
	},
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType'));
	}
});
