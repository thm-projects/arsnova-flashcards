import {Session} from "meteor/session";
import {CardEditor} from "./cardEditor";
import {Route} from "./route";

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
		let lastEditMode;
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
			lastEditMode = Session.get('lastEditMode');
			if (!isEditor) {
				switch (lastEditMode) {
					case 0:
						CardEditor.editFront();
						break;
					case 1:
						CardEditor.editBack();
						break;
					case 2:
						CardEditor.editHint();
						break;
					case 3:
						CardEditor.editLecture();
						break;
				}
				Session.set('activeEditMode', lastEditMode);
			}
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

	static isCentered (type, centerTextElement) {
		if (Route.isEditMode()) {
			return Session.get('centerTextElement')[type];
		} else {
			return centerTextElement[type];
		}
	}
};
