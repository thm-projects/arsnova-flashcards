import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./navigation.html";
import MarkdeepEditor from "../../api/markdeepEditor.js";

let markdeepEditor = new MarkdeepEditor();

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
	'click .markdeep-help': function ()  {
		markdeepEditor.help();
	},
	'click .markdeep-center': function () {
		markdeepEditor.center();
	},
	'click .markdeep-card-order': function ()  {
		markdeepEditor.orderCards();
	},
	'click .markdeep-lock': function () {
		markdeepEditor.lockCardSide();
	},
	'click .markdeep-background-style': function () {
		markdeepEditor.changeBackgroundStyle();
	},
	'click .markdeep-fullscreen': function () {
		markdeepEditor.toggleFullscreen();
	}
});

Template.markdeepNavigation.helpers({
	isCenterTextActive: function () {
		return Session.get('centerTextElement')[Session.get('activeEditMode')];
	},
	isAlternativeBackgroundStyle: function () {
		return Session.get('backgroundStyle');
	},
	isFullscreenActive: function () {
		return Session.get('fullscreen');
	}
});
