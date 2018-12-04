import {Session} from "meteor/session";
import {CardType} from "./cardTypes";
import {Meteor} from "meteor/meteor";
import {Route} from "./route.js";
import {CardNavigation} from "./cardNavigation";
import {Cardsets} from "./cardsets";
import {BertAlertVisuals} from "./bertAlertVisuals";
import {CardVisuals} from "./cardVisuals";
import {CardIndex} from "./cardIndex";
import {Cards} from "./cards";

const subjectMaxLength = 255;
const contentMaxLength = 300000;
let editorButtonIndex = 0;
let editorButtons = [];
let cardNavigationName = ".cardNavigation";
let learningGoalLevelGroupName = '#learningGoalLevelGroup .active';
let firstCardNavigationCall = false;

export let CardEditor = class CardEditor {

	static initializeEditorButtons () {
		editorButtonIndex = 0;
		editorButtons = [];
		editorButtons.push('#subjectEditor');
		if (CardType.gotLearningGoal(Session.get('cardType'))) {
			editorButtons.push(learningGoalLevelGroupName);
		}
		editorButtons.push(cardNavigationName);
		$('#editorButtonGroup').find('button').each(function () {
			editorButtons.push('#' + $(this).attr('id'));
		});
		this.setEditorButtonFocus();
	}

	static getEditorButtons () {
		return editorButtons;
	}

	static getEditorButtonIndex () {
		return editorButtonIndex;
	}

	static getCardNavigationName () {
		return cardNavigationName;
	}

	static getCardNavigationNameIndex () {
		return editorButtons.indexOf(this.getCardNavigationName());
	}

	static getLearningGoalLevelGroupName () {
		return learningGoalLevelGroupName;
	}

	static setLearningGoalLevelIndex (forward = true) {
		let navigationLength = $('#learningGoalLevelGroup:first button').length;
		let index = ($(".active").index("#learningGoalLevelGroup:first button")) + 1;
		if (forward) {
			if (index >= navigationLength) {
				index = 1;
			} else {
				++index;
			}
		} else {
			if (index <= 1) {
				index = navigationLength;
			} else {
				--index;
			}
		}
		--index;
		this.setLearningGoalLevel(index);
	}

	static setLearningGoalLevel (index) {
		$("#learningGoalLevel" + index).click();
		$("#learningGoalLevel" + index).focus();
	}

	static setEditorButtonIndex (index) {
		editorButtonIndex = index;
		this.setEditorButtonFocus();
	}

	static setEditorButtonFocus () {
		if (CardVisuals.isFullscreen() && editorButtons[editorButtonIndex] !== cardNavigationName) {
			editorButtonIndex = this.getCardNavigationNameIndex();
			firstCardNavigationCall = true;
		}
		if (editorButtons[editorButtonIndex] === cardNavigationName) {
			if (firstCardNavigationCall) {
				CardNavigation.setActiveNavigationButton(0);
				firstCardNavigationCall = false;
				CardNavigation.cardSideNavigation();
			} else {
				if (CardType.gotDictionary(Session.get('cardType')) && (!CardVisuals.isFullscreen() || (CardVisuals.isFullscreen() && CardVisuals.isEditorFullscreen()))) {
					$('#cardModalDeepLTranslation').modal('show').one('hidden.bs.modal', function () {
						CardNavigation.cardSideNavigation();
					});
				} else {
					CardNavigation.cardSideNavigation();
				}
			}
		} else if (!CardVisuals.isFullscreen()) {
			$(editorButtons[editorButtonIndex]).focus();
			if (editorButtonIndex < (editorButtons.length - 1)) {
				editorButtonIndex++;
			} else {
				editorButtonIndex = 0;
			}
			if (editorButtons[editorButtonIndex] === cardNavigationName) {
				firstCardNavigationCall = true;
			}
		}
	}

	static getMaxTextLength (type) {
		switch (type) {
			case 1:
				return subjectMaxLength;
			case 2:
				return contentMaxLength;
		}
	}

	static resetSessionData (resetSubject = false) {
		if (resetSubject && Session.get('cameFromEditMode') === false) {
			Session.set('subject', '');
			Session.set('learningUnit', "0");
			Session.set('learningIndex', "0");
		}
		Session.set('content1', '');
		Session.set('content2', '');
		Session.set('content3', '');
		Session.set('content4', '');
		Session.set('content5', '');
		Session.set('content6', '');
		Session.set('learningGoalLevel', 0);
		Session.set('backgroundStyle', 1);
		Session.set('cameFromEditMode', false);
		CardType.setDefaultCenteredText(Session.get('cardType'));
	}

	static loadEditModeContent (card) {
		let cardset = Cardsets.findOne({_id: Router.current().params._id});
		Session.set('subject', card.subject);
		Session.set('content1', card.front);
		Session.set('content2', card.back);
		Session.set('content3', card.hint);
		Session.set('content4', card.lecture);
		Session.set('content5', card.top);
		Session.set('content6', card.bottom);
		Session.set('cardType', cardset.cardType);
		Session.set('centerTextElement', card.centerTextElement);
		Session.set('alignType', card.alignType);
		Session.set('difficultyColor', cardset.difficulty);
		Session.set('learningGoalLevel', card.learningGoalLevel);
		Session.set('backgroundStyle', card.backgroundStyle);
		Session.set('learningUnit', card.learningUnit);
		Session.set('learningIndex', card.learningIndex);
	}

	static setEditorContent (index) {
		if (Route.isEditMode()) {
			editorButtonIndex = this.getCardNavigationNameIndex();
			$('#contentEditor').focus();
			$('#contentEditor').attr('tabindex', CardNavigation.getTabIndex(index, true));
		}
	}

	static initializeContent () {
		if (Session.get('subject') === undefined) {
			Session.set('subject', '');
		}
		if (Session.get('content1') === undefined) {
			Session.set('content1', '');
		}

		if (Session.get('content2') === undefined) {
			Session.set('content2', '');
		}

		if (Session.get('content3') === undefined) {
			Session.set('content3', '');
		}

		if (Session.get('content4') === undefined) {
			Session.set('content4', '');
		}

		if (Session.get('content5') === undefined) {
			Session.set('content5', '');
		}

		if (Session.get('content6') === undefined) {
			Session.set('content6', '');
		}

		if (Session.get('learningGoalLevel') === undefined) {
			Session.set('learningGoalLevel', 0);
		}

		if (Session.get('backgroundStyle') === undefined) {
			Session.set('backgroundStyle', 0);
		}

		if (Session.get('cardType') === undefined) {
			Session.set('cardType', 2);
		}

		if (Session.get('bottomText') === undefined) {
			Session.set('bottomText', '');
		}

		if (Session.get('learningIndex') === undefined) {
			Session.set('learningIndex', '0');
		}

		if (Session.get('learningUnit') === undefined) {
			Session.set('learningUnit', '0');
		}

		if (Session.get('cardDate') === undefined) {
			Session.set('cardDate', new Date());
		}
	}


	static saveCard (card_id, navigationTarget) {
		this.initializeContent();
		let content1 = Session.get('content1');
		let content2 = Session.get('content2');
		let content3 = Session.get('content3');
		let content4 = Session.get('content4');
		let content5 = Session.get('content5');
		let content6 = Session.get('content6');
		let cardType = Session.get('cardType');
		let centerTextElement = Session.get('centerTextElement');
		let alignType = Session.get('alignType');
		let date = Session.get('cardDate');
		let learningGoalLevel = Session.get('learningGoalLevel');
		let backgroundStyle = Session.get('backgroundStyle');
		let learningIndex = Session.get('learningIndex');
		let learningUnit = Session.get('learningUnit');
		let subject = Session.get('subject');
		let gotSubject = true;
		if (!CardType.gotLearningUnit(cardType)) {
			if (subject === "") {
				$('#subjectEditor').css('border', '1px solid');
				$('#subjectEditor').css('border-color', '#b94a48');
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
				gotSubject = false;
			}
		} else {
			if (subject === "" && learningUnit === "0") {
				$('#subjectEditor').css('border', '1px solid');
				$('#subjectEditor').css('border-color', '#b94a48');
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
				gotSubject = false;
			}
		}
		if ($('#subjectEditor').val().length > subjectMaxLength) {
			$('#subjectEditor .form-control').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardsubject_max', {max: subjectMaxLength}), "danger", 'growl-top-left');
		}
		if (content1.length > contentMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('text_max', {max: contentMaxLength}), "danger", 'growl-top-left');
		}
		if (content2.length > contentMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('text_max', {max: contentMaxLength}), "danger", 'growl-top-left');
		}
		if (content3.length > contentMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('text_max', {max: contentMaxLength}), "danger", 'growl-top-left');
		}
		if (content4.length > contentMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('text_max', {max: contentMaxLength}), "danger", 'growl-top-left');
		}
		if (content5.length > contentMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('text_max', {max: contentMaxLength}), "danger", 'growl-top-left');
		}
		if (content6.length > contentMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			BertAlertVisuals.displayBertAlert(TAPi18n.__('text_max', {max: contentMaxLength}), "danger", 'growl-top-left');
		}
		let editorsValidLength = (content1.length <= contentMaxLength && content2.length <= contentMaxLength && content3.length <= contentMaxLength && $('#subjectEditor').val().length <= subjectMaxLength && content4.length <= contentMaxLength && content5.length <= contentMaxLength && content6.length <= contentMaxLength);
		if (gotSubject && editorsValidLength) {
			if (ActiveRoute.name('newCard')) {
				Meteor.call("addCard", Router.current().params._id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, Number(learningGoalLevel), Number(backgroundStyle), learningIndex, learningUnit, function (error, result) {
					if (result) {
						BertAlertVisuals.displayBertAlert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
						if (navigationTarget === 0) {
							$('#contentEditor').val('');
							$('#editor').attr('data-content', '');
							CardEditor.resetSessionData();
							window.scrollTo(0, 0);
							CardEditor.setEditorButtonIndex(0);
							CardNavigation.selectButton();
						} else {
							Session.set('activeCard', result);
							Router.go('cardsetdetailsid', {
								_id: Router.current().params._id
							});
						}
					}
				});
			} else {
				Meteor.call("updateCard", card_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, Number(learningGoalLevel), Number(backgroundStyle), learningIndex, learningUnit);
				BertAlertVisuals.displayBertAlert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
				Session.set('activeCard', Router.current().params.card_id);
				if (navigationTarget === 1) {
					Router.go('cardsetdetailsid', {
						_id: Router.current().params._id
					});
				} else {
					CardEditor.setEditorButtonIndex(0);
					CardNavigation.selectButton();
					window.scrollTo(0, 0);
					let nextId = CardIndex.getNextCardID(card_id);
					Router.go('editCard', {
						_id: Router.current().params._id,
						card_id: nextId
					});
					Session.set('activeCard', nextId);
					CardEditor.loadEditModeContent(Cards.findOne({_id: nextId, cardset_id: Router.current().params._id}));
				}
			}
		}
	}
};
