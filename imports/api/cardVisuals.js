import {Session} from "meteor/session";
import {CardEditor} from "./cardEditor";
import {Route} from "./route";

let editorFullScreenActive = false;

export let CardVisuals = class CardVisuals {
	static checkFullscreen () {
		let currentRoute = Router.current().route.getName();
		if (currentRoute === (Route.isPresentation() || !Route.isDemo())) {
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
		let newFlashcardBodyHeight;
		let newFlashcardHeader;
		if (editorFullScreenActive) {
			newFlashcardBodyHeight = ($(window).height() * 0.78);
			$('#contentEditor').css('height', newFlashcardBodyHeight);
		} else {
			newFlashcardHeader = $('.active .cardHeader').outerHeight();
			let editorHeader = $('#markdeepNavigation').outerHeight();
			let newFlashcardWidth = $('#cardCarousel').width();
			if (newFlashcardWidth >= 900) {
				$(".cardContent").addClass("fullscreenContent");
			} else {
				$(".cardContent").removeClass("fullscreenContent");
			}
			newFlashcardBodyHeight = (newFlashcardWidth / Math.sqrt(2));
			$('.cardContent').css('height', newFlashcardBodyHeight - newFlashcardHeader);
			if ($(window).width() >= 1200) {
				$('#contentEditor').css('height', (newFlashcardBodyHeight - editorHeader));
			} else {
				$('#contentEditor').css('height', 'unset');
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
		if (Session.get('fullscreen') || forceOff) {
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

	/**
	 * Function changes from the backside to the front side of
	 * a card or the other way around
	 */
	static turnCard (adjustEditWindow = false) {
		if ($(".cardFrontHeader").css('display') === 'none') {
			this.turnFront(adjustEditWindow);
		} else if ($(".cardBackHeader").css('display') === 'none') {
			this.turnBack(adjustEditWindow);
		}
	}

	static isCentered (type, centerTextElement) {
		if (Route.isEditMode()) {
			return Session.get('centerTextElement')[type];
		} else {
			return centerTextElement[type];
		}
	}

	static turnFront (adjustEditWindow = false) {
		if (Session.get('reverseViewOrder')) {
			Session.set('isQuestionSide', false);
		} else {
			Session.set('isQuestionSide', true);
		}
		if (Route.isEditMode() && adjustEditWindow) {
			CardEditor.prepareFront();
		}
		$(".box .cardfront-symbol").css('display', "");
		$(".box .cardback-symbol").css('display', "none");
		$(".box .cardfront").css('display', "");
		$(".box .cardFrontHeader").css('display', "");
		$(".box .cardback").css('display', "none");
		$(".box .cardBackHeader").css('display', "none");
		$(".box").removeClass("flipped");
		$(".box .cardHeader").removeClass("back");
		$(".box .cardContent").removeClass("back");
	}

	static turnBack (adjustEditWindow = false) {
		if (Session.get('reverseViewOrder')) {
			Session.set('isQuestionSide', true);
		} else {
			Session.set('isQuestionSide', false);
		}
		if (Route.isEditMode() && adjustEditWindow) {
			CardEditor.prepareBack();
		}
		$(".cardbackCheck").css('display', "");
		$(".cardfrontCheck").css('display', "none");
		$(".box .cardfront-symbol").css('display', "none");
		$(".box .cardback-symbol").css('display', "");
		$(".box .cardfront").css('display', "none");
		$(".box .cardFrontHeader").css('display', "none");
		$(".box .cardback").css('display', "");
		$(".box .cardBackHeader").css('display', "");
		$(".box").addClass("flipped");
		$(".box .cardHeader").addClass("back");
		$(".box .cardContent").addClass("back");
	}
};
