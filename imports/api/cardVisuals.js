import {Session} from "meteor/session";
import {Route} from "./route";
import {CardType} from "./cardTypes";

let editorFullScreenActive = false;

export let CardVisuals = class CardVisuals {

	static isEditorFullscreen () {
		return editorFullScreenActive;
	}

	static checkFullscreen () {
		let currentRoute = Router.current().route.getName();
		if (currentRoute === (Route.isPresentation())) {
			this.toggleFullscreen();
			Session.set('previousRouteName', currentRoute);
		} else if (currentRoute !== Session.get('previousRouteName')) {
			Session.set('previousRouteName', currentRoute);
			this.toggleFullscreen(true);
		}
	}
	/**
	 * Adjust the width of the fixed answer options to fit the screen
	 */
	static resizeAnswers () {
		$("#answerOptions").width($("#backButton").width() + 16);
	}

	/**
	 * Resizes flashcards to din a6 format
	 */
	static resizeFlashcard () {
		let contentEditor = $('#contentEditor');
		let newFlashcardHeight;
		if (editorFullScreenActive) {
			newFlashcardHeight = ($(window).height() * 0.78);
			$('#contentEditor').css('height', newFlashcardHeight);
		} else {
			let flashcard = $('.flashcard');
			let flashcardHeader = $('.cardHeader');
			let flashcardBody = $('.cardContent');
			let flashcardLecture = $('.cardContentCollapsed');
			let flashcardControls = $('.carousel-control');
			if (flashcard.width() < 500) {
				newFlashcardHeight = flashcard.width();
				flashcard.css('height', flashcard.width());
				flashcardHeader.css('height', newFlashcardHeight * 0.20);
				flashcardBody.css('height', newFlashcardHeight * 0.8);
				flashcardLecture.css('height', newFlashcardHeight * 0.8);
				flashcardControls.css('margin-top', newFlashcardHeight * 0.2);
				flashcardControls.css('height', newFlashcardHeight * 0.8);
				contentEditor.css('height', newFlashcardHeight);
			} else {
				newFlashcardHeight = flashcard.width() / Math.sqrt(2);
				flashcard.css('height', newFlashcardHeight);
				if (flashcard.width() > 900) {
					flashcardHeader.css('height', newFlashcardHeight * 0.12);
					flashcardBody.css('height', newFlashcardHeight * 0.88);
					flashcardLecture.css('height', newFlashcardHeight * 0.88);
					flashcardControls.css('margin-top', newFlashcardHeight * 0.12);
					flashcardControls.css('height', newFlashcardHeight * 0.88);
				} else {
					flashcardHeader.css('height', newFlashcardHeight * 0.16);
					flashcardBody.css('height', newFlashcardHeight * 0.84);
					flashcardLecture.css('height', newFlashcardHeight * 0.84);
					flashcardControls.css('margin-top', newFlashcardHeight * 0.16);
					flashcardControls.css('height', newFlashcardHeight * 0.84);
				}
				contentEditor.css('height', newFlashcardHeight - $('#markdeepNavigation').height());
			}
		}
	}

	/**
	 * Toggle the card view between fullscreen and normal mode
	 */
	static toggleFullscreen (forceOff = false, isEditor = false) {
		if (forceOff && (!Route.isBox() && !Route.isMemo())) {
			Session.set("workloadFullscreenMode", false);
		}
		Session.set('dictionaryPreview', 0);
		if ((Session.get('fullscreen') || forceOff) && (!Route.isPresentation())) {
			Session.set('fullscreen', false);
			$("#theme-wrapper").css("margin-top", "70px");
			$("#answerOptions").css("margin-top", "0");
			$(".editorElement").css("display", '');
			$("#preview").css("display", "unset");
			$("#markdeepNavigation").css("display", '');
			$("#markdeepEditorContent").css("display", '');
			$(".fullscreen-button").removeClass("pressed");
			let card_id;
			if (Router.current().params.card_id) {
				card_id = Router.current().params.card_id;
			} else {
				card_id = "-1";
			}
			$("#collapseLecture-" + card_id).removeClass('in');
			editorFullScreenActive = false;
		} else {
			Session.set('fullscreen', true);
			$(".box").removeClass("disableCardTransition");
			$("#theme-wrapper").css("margin-top", "20px");
			$("#answerOptions").css("margin-top", "-50px");
			$(".editorElement").css("display", "none");
			if (isEditor) {
				$("#preview").css("display", "none");
				editorFullScreenActive = true;
				$(".fullscreen-button").addClass("pressed");
			} else {
				$("#markdeepNavigation").css("display", "none");
				$("#markdeepEditorContent").css("display", 'none');
			}
		}
	}

	static isCentered (contentId, centerTextElement) {
		--contentId;
		if (Route.isEditMode()) {
			return Session.get('centerTextElement')[contentId];
		} else {
			return centerTextElement[contentId];
		}
	}

	static getCardSideColor (difficulty, cardType, backgroundStyle, activeCard) {
		let box = "box-";
		let style;
		if (activeCard) {
			style = Session.get('activeCardStyle');
		} else {
			let cubeSides = CardType.getCardTypeCubeSides(cardType);
			style = cubeSides[0].defaultStyle;
		}
		if (style === "default") {
			if (!CardType.gotDifficultyLevel(cardType)) {
				if (backgroundStyle === 0) {
					return box + 'difficultyLined0';
				} else {
					return box + 'difficultyBlank0';
				}
			}
			if (difficulty === 0 && !CardType.gotNotesForDifficultyLevel(cardType)) {
				difficulty = 1;
			}
			if (backgroundStyle === 0) {
				switch (difficulty) {
					case 0:
						if (CardType.gotNotesForDifficultyLevel(cardType)) {
							return box + 'difficultyLinedNote0';
						}
						break;
					case 1:
						return box + 'difficultyLined1';
					case 2:
						return box + 'difficultyLined2';
					case 3:
						return box + 'difficultyLined3';
					default:
						return '';
				}
			} else {
				switch (difficulty) {
					case 0:
						if (CardType.gotNotesForDifficultyLevel(cardType)) {
							return box + 'difficultyBlankNote0';
						}
						break;
					case 1:
						return box + 'difficultyBlank1';
					case 2:
						return box + 'difficultyBlank2';
					case 3:
						return box + 'difficultyBlank3';
					default:
						return '';
				}
			}
		} else {
			return box + style;
		}
	}

	static isTextCentered () {
		let centerTextElement = Session.get('centerTextElement');
		let contentId = Session.get('activeCardContentId');
		--contentId;
		if (centerTextElement !== undefined && centerTextElement[contentId]) {
			$(".center-button").addClass('pressed');
		} else {
			$(".center-button").removeClass('pressed');
		}
	}
	static checkBackgroundStyle () {
		if (Session.get('backgroundStyle')) {
			$(".editorBrush").addClass('pressed');
		} else {
			$(".editorBrush").removeClass('pressed');
		}
	}
};
