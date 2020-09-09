import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {CardType} from "./cardTypes";
import {Meteor} from "meteor/meteor";
import {Route} from "./route.js";
import {CardNavigation} from "./cardNavigation";
import {Cardsets} from "../api/subscriptions/cardsets";
import {BertAlertVisuals} from "./bertAlertVisuals";
import {CardVisuals} from "./cardVisuals";
import {CardIndex} from "./cardIndex";
import {Cards} from "../api/subscriptions/cards";
import {MarkdeepEditor} from "./markdeepEditor";
import {Fullscreen} from "./fullscreen";

const subjectMaxLength = 255;
const contentMaxLength = 300000;

let editorButtonIndex = 0;
let editorButtons = [];
let cardNavigationName = ".cardNavigation";
let learningGoalLevelGroupName = '#learningGoalLevelGroup .active';
let firstCardNavigationCall = false;

let emptyMarkdeepAnswers = [
	{
		answer: '',
		explanation: ''
	},
	{
		answer: '',
		explanation: ''
	}
];

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
		if (CardType.gotLearningGoal(Session.get('cardType'))) {
			editorButtons.push('#initialLearningTimeInput');
			editorButtons.push('#repeatedLearningTimeInput');
		}
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

	static setEditorButtonIndex (index, clickButton = true) {
		editorButtonIndex = index;
		if (clickButton) {
			this.setEditorButtonFocus();
		}
	}

	static setEditorButtonFocus () {
		if (Fullscreen.isActive() && editorButtons[editorButtonIndex] !== cardNavigationName) {
			editorButtonIndex = this.getCardNavigationNameIndex();
			firstCardNavigationCall = true;
		}
		if (editorButtons[editorButtonIndex] === cardNavigationName) {
			if (firstCardNavigationCall) {
				CardNavigation.setActiveNavigationButton(0);
				firstCardNavigationCall = false;
				CardNavigation.cardSideNavigation();
			} else {
				if (CardType.gotDictionary(Session.get('cardType')) && (!Fullscreen.isActive() || (CardVisuals.isFullscreen() && Fullscreen.isEditorFullscreenActive()))) {
					$('#cardModalBeolingusTranslation').modal('show').one('hidden.bs.modal', function () {
						CardNavigation.cardSideNavigation();
					});
				} else {
					CardNavigation.cardSideNavigation();
				}
			}
		} else if (!Fullscreen.isActive()) {
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

	static resetSessionData (resetSubject = false) {
		if (resetSubject && Session.get('cameFromEditMode') === false) {
			Session.set('subject', '');
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
		Session.set('initialLearningTime', -1);
		Session.set('repeatedLearningTime', -1);
		Session.set('markdeepEditorAnswers', emptyMarkdeepAnswers);
		Session.set('activeAnswerID', -1);
		Session.set('rightAnswers', []);
		Session.set('randomizeAnswerPositions', false);
		Session.set('isExplanationEditorEnabled', false);
		if (CardType.gotAnswerOptions(Session.get('cardType')) && CardType.gotNoSideContent(Session.get('cardType'))) {
			Session.set('answersEnabled', true);
		} else {
			Session.set('answersEnabled', false);
		}
		CardType.setDefaultCenteredText(Session.get('cardType'));
	}

	static loadEditModeContent (card) {
		let difficulty;
		let cardType;
		if (Route.isTranscript()) {
			difficulty = card.difficulty;
			cardType = card.cardType;
		} else {
			let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')});
			difficulty = cardset.difficulty;
			cardType = cardset.cardType;
		}
		Session.set('subject', card.subject);
		Session.set('content1', card.front);
		Session.set('content2', card.back);
		Session.set('content3', card.hint);
		Session.set('content4', card.lecture);
		Session.set('content5', card.top);
		Session.set('content6', card.bottom);
		Session.set('cardType', cardType);
		Session.set('centerTextElement', card.centerTextElement);
		Session.set('alignType', card.alignType);
		Session.set('difficultyColor', difficulty);
		Session.set('learningGoalLevel', card.learningGoalLevel);
		Session.set('backgroundStyle', card.backgroundStyle);
		Session.set('initialLearningTime', card.learningTime.initial);
		Session.set('repeatedLearningTime', card.learningTime.repeated);
		if (card.answers !== undefined) {
			if (card.answers.content !== undefined) {
				Session.set('markdeepEditorAnswers', card.answers.content);
			} else {
				Session.set('markdeepEditorAnswers', emptyMarkdeepAnswers);
			}
			if (card.answers.rightAnswers !== undefined) {
				Session.set('rightAnswers', card.answers.rightAnswers);
			} else {
				Session.set('rightAnswers', []);
			}
			if (card.answers.randomized !== undefined) {
				Session.set('randomizeAnswerPositions', card.answers.randomized);
			} else {
				Session.set('randomizeAnswerPositions', false);
			}
			if (card.answers.question !== undefined) {
				Session.set('cardAnswersQuestion', card.answers.question);
			} else {
				Session.set('cardAnswersQuestion', '');
			}
			if (card.answers.enabled !== undefined) {
				Session.set('answersEnabled', card.answers.enabled);
			} else {
				Session.set('answersEnabled', false);
			}
		} else {
			Session.set('markdeepEditorAnswers', emptyMarkdeepAnswers);
			Session.set('rightAnswers', []);
			Session.set('randomizeAnswerPositions', false);
			Session.set('answersEnabled', false);
		}
	}

	static setEditorContent (index) {
		if (Route.isEditMode()) {
			editorButtonIndex = this.getCardNavigationNameIndex();
			$('#contentEditor').attr('tabindex', CardNavigation.getTabIndex(index, true));
			MarkdeepEditor.focusOnContentEditor();
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

		if (Session.get('cardDate') === undefined) {
			Session.set('cardDate', new Date());
		}
	}

	static goBackToPreviousRoute () {
		let cardset = Session.get('cardEditMode').cardset;
		let previousRoute = Session.get('cardEditMode').route;
		switch (previousRoute) {
			case "leitner":
				FlowRouter.go('box', {
					_id: cardset
				});
				break;
			case "wozniak":
				FlowRouter.go('memo', {
					_id: cardset
				});
				break;
			case "presentation":
				FlowRouter.go('presentation', {
					_id: cardset
				});
				break;
			default:
				FlowRouter.go('cardsetdetailsid', {
					_id: cardset
				});
				break;
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
		let subject = Session.get('subject');
		let gotSubject = true;
		let initialLearningTime = Session.get('initialLearningTime');
		let repeatedLearningTime = Session.get('repeatedLearningTime');
		let answers = {};
		if (CardType.gotAnswerOptions(cardType)) {
			answers.rightAnswers = Session.get('rightAnswers');
			answers.randomized = Session.get('randomizeAnswerPositions');
			answers.content = Session.get('markdeepEditorAnswers');
			answers.question = Session.get('cardAnswersQuestion');
			if (CardType.gotAnswerOptions(Session.get('cardType')) && CardType.gotNoSideContent(Session.get('cardType'))) {
				answers.enabled = true;
			} else {
				answers.enabled = Session.get('answersEnabled');
			}
			if (answers.enabled) {
				let gotValidAnswers = true;
				for (let i = 0; i < answers.content.length; i++) {
					let answer = answers.content[i].answer;
					if (answer !== undefined && answer.trim().length === 0) {
						gotValidAnswers = false;
						break;
					}
				}
				if (gotValidAnswers === false) {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('card.markdeepEditor.notification.noAnswers'), "danger", 'growl-top-left');
					return;
				} else if (answers.rightAnswers.length === 0) {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('card.markdeepEditor.notification.noRightAnswer'), "danger", 'growl-top-left');
					return;
				}
			}
		}
		if (!CardType.gotLearningUnit(cardType)) {
			if (subject === "") {
				$('#subjectEditor').css('border', '1px solid');
				$('#subjectEditor').css('border-color', '#b94a48');
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
				gotSubject = false;
			}
		} else {
			if (subject === "" && Session.get('transcriptBonus') === undefined) {
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
			if (Route.isNewCard()) {
				let cardset_id = "-1";
				if (!Route.isTranscript()) {
					cardset_id = FlowRouter.getParam('_id');
				}
				Meteor.call("addCard", cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, Number(learningGoalLevel), Number(backgroundStyle), Session.get('transcriptBonus'), Number(initialLearningTime), Number(repeatedLearningTime), answers, function (error, result) {
					if (result) {
						BertAlertVisuals.displayBertAlert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
						if (navigationTarget === 0) {
							$('#contentEditor').val('');
							$('#editor').attr('data-content', '');
							CardEditor.resetSessionData();
							window.scrollTo(0, 0);
							CardEditor.setEditorButtonIndex(CardEditor.getCardNavigationNameIndex(), false);
							if (CardType.gotAnswerOptions(Session.get('cardType')) && CardType.gotNoSideContent(Session.get('cardType'))) {
								MarkdeepEditor.focusOnAnswerSide();
							} else {
								CardNavigation.selectButton();
							}
						} else {
							if (Route.isTranscript()) {
								if (Session.get('transcriptBonus') !== undefined) {
									FlowRouter.go('transcriptsBonus');
								} else {
									FlowRouter.go('transcriptsPersonal');
								}
							} else {
								Session.set('activeCard', result);
								FlowRouter.go('cardsetdetailsid', {
									_id: FlowRouter.getParam('_id')
								});
							}
						}
					}
					if (error) {
						BertAlertVisuals.displayBertAlert(error.error, "danger", 'growl-top-left');
					}
				});
			} else {
				Meteor.call("updateCard", card_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, Number(learningGoalLevel), Number(backgroundStyle), Session.get('transcriptBonus'), Number(initialLearningTime), Number(repeatedLearningTime), answers, function (error, result) {
					if (result) {
						BertAlertVisuals.displayBertAlert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
						Session.set('activeCard', FlowRouter.getParam('card_id'));
						if (navigationTarget === 1) {
							if (Route.isTranscript()) {
								if (Session.get('transcriptBonus') !== undefined) {
									FlowRouter.go('transcriptsBonus');
								} else {
									FlowRouter.go('transcriptsPersonal');
								}
							} else {
								if (Session.get('cardEditMode') !== undefined) {
									CardEditor.goBackToPreviousRoute();
								} else {
									FlowRouter.go('presentation', {
										_id: FlowRouter.getParam('_id')
									});
								}
							}
						} else {
							CardEditor.setEditorButtonIndex(CardEditor.getCardNavigationNameIndex(), false);
							if (CardType.gotAnswerOptions(Session.get('cardType')) && CardType.gotNoSideContent(Session.get('cardType'))) {
								MarkdeepEditor.focusOnAnswerSide();
							} else {
								CardNavigation.selectButton();
							}
							window.scrollTo(0, 0);
							let nextId = CardIndex.getNextCardID(card_id);
							FlowRouter.go('editCard', {
								_id: FlowRouter.getParam('_id'),
								card_id: nextId
							});
							Session.set('activeCard', nextId);
							CardEditor.loadEditModeContent(Cards.findOne({_id: nextId, cardset_id: FlowRouter.getParam('_id')}));
						}
					}
					if (error) {
						BertAlertVisuals.displayBertAlert(error.error, "danger", 'growl-top-left');
					}
				});
			}
		}
	}
};
