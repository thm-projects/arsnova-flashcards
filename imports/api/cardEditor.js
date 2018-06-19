import {Session} from "meteor/session";
import {CardType} from "./cardTypes";
import {Meteor} from "meteor/meteor";
import {Cards} from "./cards";
import {Route} from "./route.js";

const frontMaxLength = 100000;
const backMaxLength = 100000;
const hintMaxLength = 100000;
const lectureMaxLength = 300000;
const topMaxLength = 100000;
const bottomMaxLength = 100000;
const subjectMaxLength = 255;

export let CardEditor = class CardEditor {
	static getMaxTextLength (type) {
		switch (type) {
			case 0:
				return frontMaxLength;
			case 1:
				return backMaxLength;
			case 2:
				return hintMaxLength;
			case 3:
				return lectureMaxLength;
			case 4:
				return topMaxLength;
			case 5:
				return bottomMaxLength;
			case 6:
				return subjectMaxLength;
		}
	}

	static isTextCentered () {
		let centerTextElement = Session.get('centerTextElement');
		let editMode = Session.get('activeEditMode');
		if (centerTextElement !== undefined && centerTextElement[editMode]) {
			$(".center-button").addClass('pressed');
		} else {
			$(".center-button").removeClass('pressed');
		}
	}

	static updateNavigation () {
		let card_id = $('.carousel-inner > .active').attr('data-id');
		Session.set('activeCard', card_id);
		let cardType = Cards.findOne({_id: card_id}).cardType;
		Session.set('cardType', Number(cardType));
	}

	static checkBackgroundStyle () {
		if (Session.get('backgroundStyle')) {
			$(".editorBrush").addClass('pressed');
		} else {
			$(".editorBrush").removeClass('pressed');
		}
	}

	static resetSessionData (resetSubject = false) {
		CardType.defaultCenteredText(Session.get('cardType'));
		if (resetSubject && Session.get('cameFromEditMode') === false) {
			Session.set('subjectText', '');
			Session.set('learningUnit', "0");
			Session.set('learningIndex', "0");
		}
		Session.set('frontText', '');
		Session.set('backText', '');
		Session.set('hintText', '');
		Session.set('lectureText', '');
		Session.set('topText', '');
		Session.set('bottomText', '');
		Session.set('learningGoalLevel', 0);
		Session.set('backgroundStyle', 1);
		Session.set('cameFromEditMode');
	}

	static prepareFront () {
		this.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('isQuestionSide', true);
		if (Session.get('activeEditMode') === 1) {
			$(".box").removeClass("disableCardTransition");
		}
		Session.set('activeEditMode', 0);
		Session.set('lastEditMode', Session.get('activeEditMode'));
		$('#contentEditor').focus();
		$('#contentEditor').attr('tabindex', 6);
		if (!Route.isPresentationOrDemo()) {
			if (CardType.gotSidesSwapped(Session.get('cardType'))) {
				$('#contentEditor').val(Session.get('backText'));
				$('#editor').attr('data-content', Session.get('backText'));
			} else {
				$('#contentEditor').val(Session.get('frontText'));
				$('#editor').attr('data-content', Session.get('frontText'));
			}
		}
		$('#editFront').removeClass('btn-default').addClass('btn-primary');
		$('#editBack').removeClass('btn-primary').addClass('btn-default');
		$('#editHint').removeClass('btn-primary').addClass('btn-default');
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
		$('#editTop').removeClass('btn-primary').addClass('btn-default');
		$('#editBottom').removeClass('btn-primary').addClass('btn-default');
	}

	static prepareBack () {
		this.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('isQuestionSide', false);
		if (Session.get('activeEditMode') !== 0 && (Session.get('activeEditMode') === 2 || Session.get('activeEditMode') === 3)) {
			$(".box").addClass("disableCardTransition");
		} else if (Session.get('activeEditMode') === 0) {
			$(".box").removeClass("disableCardTransition");
		}
		Session.set('activeEditMode', 1);
		Session.set('lastEditMode', Session.get('activeEditMode'));
		$('#contentEditor').focus();
		$('#contentEditor').attr('tabindex', 10);
		if (!Route.isPresentationOrDemo()) {
			if (CardType.gotSidesSwapped(Session.get('cardType'))) {
				$('#contentEditor').val(Session.get('frontText'));
				$('#editor').attr('data-content', Session.get('frontText'));
			} else {
				$('#contentEditor').val(Session.get('backText'));
				$('#editor').attr('data-content', Session.get('backText'));
			}
		}
		$('#editFront').removeClass('btn-primary').addClass('btn-default');
		$('#editBack').removeClass('btn-default').addClass('btn-primary');
		$('#editHint').removeClass('btn-primary').addClass('btn-default');
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
		$('#editTop').removeClass('btn-primary').addClass('btn-default');
		$('#editBottom').removeClass('btn-primary').addClass('btn-default');
	}

	static editFront () {
		this.prepareFront();
	}

	static editBack () {
		this.prepareBack();
	}

	static editLecture () {
		this.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('activeEditMode', 3);
		Session.set('lastEditMode', Session.get('activeEditMode'));
		$('#contentEditor').focus();
		$('#contentEditor').attr('tabindex', 8);
		if (!Route.isPresentationOrDemo()) {
			$('#contentEditor').val(Session.get('lectureText'));
			$('#editor').attr('data-content', Session.get('lectureText'));
		}
		$('#editFront').removeClass('btn-primary').addClass('btn-default');
		$('#editBack').removeClass('btn-primary').addClass('btn-default');
		$('#editHint').removeClass('btn-primary').addClass('btn-default');
		$('#editLecture').removeClass('btn-default').addClass('btn-primary');
		$('#editTop').removeClass('btn-primary').addClass('btn-default');
		$('#editBottom').removeClass('btn-primary').addClass('btn-default');
	}

	static editHint () {
		this.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('activeEditMode', 2);
		Session.set('lastEditMode', Session.get('activeEditMode'));
		$('#contentEditor').focus();
		$('#contentEditor').attr('tabindex', 12);
		if (!Route.isPresentationOrDemo()) {
			$('#contentEditor').val(Session.get('hintText'));
			$('#editor').attr('data-content', Session.get('hintText'));
		}
		$('#editFront').removeClass('btn-primary').addClass('btn-default');
		$('#editBack').removeClass('btn-primary').addClass('btn-default');
		$('#editHint').removeClass('btn-default').addClass('btn-primary');
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
		$('#editTop').removeClass('btn-primary').addClass('btn-default');
		$('#editBottom').removeClass('btn-primary').addClass('btn-default');
	}

	static editTop () {
		this.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('activeEditMode', 4);
		Session.set('lastEditMode', Session.get('activeEditMode'));
		$('#contentEditor').focus();
		$('#contentEditor').attr('tabindex', 14);
		if (!Route.isPresentationOrDemo()) {
			$('#contentEditor').val(Session.get('topText'));
			$('#editor').attr('data-content', Session.get('topText'));
		}
		$('#editFront').removeClass('btn-primary').addClass('btn-default');
		$('#editBack').removeClass('btn-primary').addClass('btn-default');
		$('#editHint').removeClass('btn-primary').addClass('btn-default');
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
		$('#editTop').removeClass('btn-default').addClass('btn-primary');
		$('#editBottom').removeClass('btn-primary').addClass('btn-default');
	}

	static editBottom () {
		this.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('activeEditMode', 5);
		Session.set('lastEditMode', Session.get('activeEditMode'));
		$('#contentEditor').focus();
		$('#contentEditor').attr('tabindex', 16);
		if (!Route.isPresentationOrDemo()) {
			$('#contentEditor').val(Session.get('bottomText'));
			$('#editor').attr('data-content', Session.get('bottomText'));
		}
		$('#editFront').removeClass('btn-primary').addClass('btn-default');
		$('#editBack').removeClass('btn-primary').addClass('btn-default');
		$('#editHint').removeClass('btn-primary').addClass('btn-default');
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
		$('#editTop').removeClass('btn-primary').addClass('btn-default');
		$('#editBottom').removeClass('btn-default').addClass('btn-primary');
	}

	static initializeContent () {
		if (Session.get('subjectText') === undefined) {
			Session.set('subjectText', '');
		}
		if (Session.get('frontText') === undefined) {
			Session.set('frontText', '');
		}

		if (Session.get('backText') === undefined) {
			Session.set('backText', '');
		}

		if (Session.get('hintText') === undefined) {
			Session.set('hintText', '');
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

		if (Session.get('lectureText') === undefined) {
			Session.set('lectureText', '');
		}

		if (Session.get('topText') === undefined) {
			Session.set('topText', '');
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


	static saveCard (card_id, returnToCardset) {
		this.initializeContent();
		let frontText = Session.get('frontText');
		let backText = Session.get('backText');
		let hintText = Session.get('hintText');
		let lectureText = Session.get('lectureText');
		let topText = Session.get('topText');
		let bottomText = Session.get('bottomText');
		let cardType = Session.get('cardType');
		let centerTextElement = Session.get('centerTextElement');
		let date = Session.get('cardDate');
		let learningGoalLevel = Session.get('learningGoalLevel');
		let backgroundStyle = Session.get('backgroundStyle');
		let learningIndex = Session.get('learningIndex');
		let learningUnit = Session.get('learningUnit');
		let subjectText = Session.get('subjectText');
		let gotSubject = true;
		if (!CardType.gotLearningUnit(cardType)) {
			if (subjectText === "") {
				$('#subjectEditor').css('border', '1px solid');
				$('#subjectEditor').css('border-color', '#b94a48');
				Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
				gotSubject = false;
			}
		} else {
			if (subjectText === "" && learningUnit === "0") {
				$('#subjectEditor').css('border', '1px solid');
				$('#subjectEditor').css('border-color', '#b94a48');
				Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
				gotSubject = false;
			}
		}
		if ($('#subjectEditor').val().length > subjectMaxLength) {
			$('#subjectEditor .form-control').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('cardsubject_max', {max: subjectMaxLength}), "danger", 'growl-top-left');
		}
		if (frontText.length > frontMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('text_max', {max: frontMaxLength}), "danger", 'growl-top-left');
		}
		if (backText.length > backMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('text_max', {max: backMaxLength}), "danger", 'growl-top-left');
		}
		if (hintText.length > hintMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('text_max', {max: hintMaxLength}), "danger", 'growl-top-left');
		}
		if (topText.length > topMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('text_max', {max: topMaxLength}), "danger", 'growl-top-left');
		}
		if (bottomText.length > bottomMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('text_max', {max: bottomMaxLength}), "danger", 'growl-top-left');
		}
		if (CardType.gotLecture(cardType) && lectureText.length > lectureMaxLength) {
			$('#editor .md-editor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('text_max', {max: lectureMaxLength}), "danger", 'growl-top-left');
		}
		let editorsValidLength = (frontText.length <= frontMaxLength && backText.length <= backMaxLength && lectureText.length <= lectureMaxLength && $('#subjectEditor').val().length <= subjectMaxLength && hintText.length <= hintMaxLength && topText.length <= topMaxLength && bottomText.length <= bottomMaxLength);
		if (gotSubject && editorsValidLength) {
			if (ActiveRoute.name('newCard')) {
				Meteor.call("addCard", Router.current().params._id, subjectText, hintText, frontText, backText, lectureText, topText, bottomText, centerTextElement, date, Number(learningGoalLevel), Number(backgroundStyle), learningIndex, learningUnit, function (error, result) {
					if (result) {
						Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
						if (returnToCardset) {
							Router.go('cardsetdetailsid', {
								_id: Router.current().params._id
							});
						} else {
							$('#contentEditor').val('');
							$('#editor').attr('data-content', '');
							CardEditor.resetSessionData();
							window.scrollTo(0, 0);
							$('#editFront').click();
						}
					}
				});
			} else {
				Meteor.call("updateCard", card_id, subjectText, hintText, frontText, backText, lectureText, topText, bottomText, centerTextElement, Number(learningGoalLevel), Number(backgroundStyle), learningIndex, learningUnit);
				Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
				if (returnToCardset) {
					Router.go('cardsetdetailsid', {
						_id: Router.current().params._id
					});
				} else {
					Session.set('cameFromEditMode', true);
					Router.go('newCard', {
						_id: Router.current().params._id
					});
				}
			}
		}
	}

};
