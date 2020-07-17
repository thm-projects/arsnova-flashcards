import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {MarkdeepEditor} from "../../../../util/markdeepEditor.js";
import {CardVisuals} from "../../../../util/cardVisuals";
import {Dictionary} from "../../../../util/dictionary";
import {CardType} from "../../../../util/cardTypes";
import {Route} from "../../../../util/route";
import * as config from "../../../../config/markdeepEditor.js";
import "./item/answerEditor.js";
import "./navigation.html";

/*
 * ############################################################################
 * markdeepNavigation
 * ############################################################################
 */
Template.markdeepNavigation.events({
	'click .markdeep-answer-editor': function () {
		MarkdeepEditor.toggleAnswerEditor();
	},
	'click .markdeep-help': function () {
		MarkdeepEditor.help();
	},
	'click .markdeep-mobile-preview': function () {
		MarkdeepEditor.changeMobilePreview();
		CardVisuals.setDefaultViewingMode(3);
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
		$('#cardModalBeolingusTranslation').modal('show');
	},
	'input #initialLearningTimeInput': function () {
		let input = $('#initialLearningTimeInput');
		let value = Number(input.val());

		if (value > config.cardLearningTime.initial.max) {
			input.val(config.cardLearningTime.initial.max);
		} else if (value < config.cardLearningTime.initial.min) {
			input.val(config.cardLearningTime.initial.min);
		}
		if (input.val().split('.')[1] !== undefined) {
			input.val(Number(input.val()).toFixed(1));
		}

		let newValue = -1;
		let cardTypeVariables = CardType.getCardTypeVariables(Session.get('cardType'));
		if (value > -1 && value !== cardTypeVariables.learningTime.initial) {
			newValue = input.val();
		}
		Session.set('initialLearningTime', newValue);
	},
	'input #repeatedLearningTimeInput': function () {
		let input = $('#repeatedLearningTimeInput');
		let value = Number(input.val());

		if (value > config.cardLearningTime.repeated.max) {
			input.val(config.cardLearningTime.repeated.max);
		} else if (value < config.cardLearningTime.repeated.min) {
			input.val(config.cardLearningTime.repeated.min);
		}

		if (input.val().split('.')[1] !== undefined) {
			input.val(Number(input.val()).toFixed(1));
		}

		let newValue = -1;
		let cardTypeVariables = CardType.getCardTypeVariables(Session.get('cardType'));
		if (value > -1 && value !== cardTypeVariables.learningTime.repeated) {
			newValue = value;
		}
		Session.set('repeatedLearningTime', newValue);
	}
});

Template.markdeepNavigation.helpers({
	gotAnswerOptions: function () {
		return CardType.gotAnswerOptions(Session.get('cardType'));
	},
	isAnswerEditorActive: function () {
		return Session.get('isAnswerEditorEnabled');
	},
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
		return Session.get('isDeepLModalVisible');
	},
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType')) && Route.isEditMode();
	},
	gotMarkdeepHelp: function () {
		if (Route.isEditMode()) {
			return CardType.gotMarkdeepHelp(Session.get('cardType'));
		} else {
			return true;
		}
	},
	gotLearningTime: function () {
		return CardType.gotLearningModes(Session.get('cardType'));
	},
	getLearningTimeSetting: function (type, value) {
		return config.cardLearningTime[type][value];
	},
	getInitialLearningTime: function () {
		let value = Session.get('initialLearningTime');
		if (value === -1) {
			let cardTypeVariables = CardType.getCardTypeVariables(Session.get('cardType'));
			return cardTypeVariables.learningTime.initial;
		} else {
			return value;
		}
	},
	getRepeatedLearningTime: function () {
		let value = Session.get('repeatedLearningTime');
		if (value === -1) {
			let cardTypeVariables = CardType.getCardTypeVariables(Session.get('cardType'));
			return cardTypeVariables.learningTime.repeated;
		} else {
			return value;
		}
	}
});
