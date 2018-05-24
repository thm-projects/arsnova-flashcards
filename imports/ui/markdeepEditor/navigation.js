import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./navigation.html";
import MarkdeepEditor from "../../api/markdeepEditor.js";
import CardType from "../../api/cardTypes";

export function isTextCentered() {
	let centerTextElement = Session.get('centerTextElement');
	let editMode = Session.get('activeEditMode');
	if (centerTextElement !== undefined && centerTextElement[editMode]) {
		$(".center-button").addClass('pressed');
	} else {
		$(".center-button").removeClass('pressed');
	}
}

/*
 * ############################################################################
 * markdeepNavigation
 * ############################################################################
 */
Template.markdeepNavigation.events({
	'click .markdeep-help': function () {
		MarkdeepEditor.help();
	},
	'click .markdeep-center': function () {
		MarkdeepEditor.center();
	},
	'click .markdeep-background-style': function () {
		MarkdeepEditor.changeBackgroundStyle();
	},
	'click .markdeep-dictionary': function () {
		MarkdeepEditor.displayDictionary();
	},
	'click .markdeep-fullscreen': function () {
		MarkdeepEditor.toggleFullscreen();
	}
});

Template.markdeepNavigation.helpers({
	isCenterTextActive: function () {
		return Session.get('centerTextElement')[Session.get('activeEditMode')];
	},
	isDictionaryActive: function () {
		return Session.get('dictionaryPreview');
	},
	isAlternativeBackgroundStyle: function () {
		return Session.get('backgroundStyle');
	},
	isFullscreenActive: function () {
		return Session.get('fullscreen');
	},
	gotOneColumn: function () {
		return CardType.gotOneColumn(Session.get('cardType'));
	},
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType'));
	},
	isHintPreview: function () {
		return Session.get('activeEditMode') === 2;
	}
});
