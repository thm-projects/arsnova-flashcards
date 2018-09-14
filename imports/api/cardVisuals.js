import {Session} from "meteor/session";
import {Route} from "./route";
import {CardType} from "./cardTypes";
import * as screenfull from 'screenfull';
import {NavigatorCheck} from "./navigatorCheck";
import {Cardsets} from "./cardsets";
import {MarkdeepEditor} from "./markdeepEditor";

let editorFullScreenActive = false;
let defaultFontSize = 16;
let defaultTextZoomValue = 100;

export let CardVisuals = class CardVisuals {

	static isEditorFullscreen () {
		return editorFullScreenActive;
	}

	static isFullscreen () {
		return Session.get('fullscreen');
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
			let flashcardHeaderHeight = 0;
			let flashcardBodyHeight = 0;
			Session.set('windowWidth', $(window).width());
			if (Session.get('windowWidth') < 768 || Session.get('mobilePreview')) {
				if (Session.get('mobilePreview')) {
					newFlashcardHeight = $('.mobilePreviewContent').innerHeight() - 50;
				} else {
					newFlashcardHeight = $(window).height() - (flashcard.offset().top + 10);
				}
				flashcardHeaderHeight = 60;
				flashcardBodyHeight = newFlashcardHeight - flashcardHeaderHeight;
				flashcard.css('height', newFlashcardHeight);
				flashcardHeader.css('height', flashcardHeaderHeight);
				flashcardBody.css('height', flashcardBodyHeight);
				flashcardLecture.css('height', flashcardBodyHeight);
				flashcardControls.css('margin-top', flashcardHeaderHeight);
				flashcardControls.css('height', flashcardBodyHeight);
				contentEditor.css('height', flashcardBodyHeight);
			} else {
				newFlashcardHeight = flashcard.width() / Math.sqrt(2);
				flashcard.css('height', newFlashcardHeight);
				if (flashcard.width() > 900) {
					flashcardHeaderHeight = 0.12;
					flashcardBodyHeight = 0.88;
					flashcardHeader.css('height', newFlashcardHeight * flashcardHeaderHeight);
					flashcardBody.css('height', newFlashcardHeight * flashcardBodyHeight);
					flashcardLecture.css('height', newFlashcardHeight * flashcardBodyHeight);
					flashcardControls.css('margin-top', newFlashcardHeight * flashcardHeaderHeight);
					flashcardControls.css('height', newFlashcardHeight * flashcardBodyHeight);
				} else {
					flashcardHeaderHeight = 0.16;
					flashcardBodyHeight = 0.84;
					flashcardHeader.css('height', newFlashcardHeight * flashcardHeaderHeight);
					flashcardBody.css('height', newFlashcardHeight * flashcardBodyHeight);
					flashcardLecture.css('height', newFlashcardHeight * flashcardBodyHeight);
					flashcardControls.css('margin-top', newFlashcardHeight * flashcardHeaderHeight);
					flashcardControls.css('height', newFlashcardHeight * flashcardBodyHeight);
				}
			}
			if (Session.get('mobilePreview') && $(window).width() >= 1200) {
				contentEditor.css('height', $('.mobilePreviewFrame').outerHeight() - ($('#button-row').height() + $('#markdeepNavigation').height() + 9));
			} else {
				contentEditor.css('height', newFlashcardHeight - $('#markdeepNavigation').height());
			}
			this.setSidebarPosition();
		}
	}

	/**
	 * Toggle the card view between fullscreen and normal mode
	 */
	static toggleFullscreen (forceOff = false, isEditor = false) {
		if (forceOff && (!Route.isBox() && !Route.isMemo())) {
			Session.set("workloadFullscreenMode", false);
		}
		Session.set('dictionaryBeolingus', 0);
		Session.set('dictionaryLinguee', 0);
		Session.set('dictionaryGoogle', 0);
		if ((Session.get('fullscreen') || forceOff) && (!Route.isPresentation() && !Route.isBox() && !Route.isMemo()) && !Session.get('workloadFullscreenMode')) {
			if (!NavigatorCheck.isIOS()) {
				screenfull.exit();
			}
			$("#theme-wrapper").css("margin-top", "55px");
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
			Session.set('fullscreen', false);
		} else {
			if (!NavigatorCheck.isIOS()) {
				screenfull.request();
			}
			$(".box").removeClass("disableCardTransition");
			$("#theme-wrapper").css("margin-top", "5px");
			$(".editorElement").css("display", "none");
			if (isEditor) {
				$("#preview").css("display", "none");
				editorFullScreenActive = true;
				$(".fullscreen-button").addClass("pressed");
			} else {
				$("#markdeepNavigation").css("display", "none");
				$("#markdeepEditorContent").css("display", 'none');
			}
			Session.set('fullscreen', true);
		}
	}

	static isCentered (contentId, centerTextElement) {
		if (centerTextElement === undefined) {
			return false;
		}
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
		if (Session.get('theme') === "contrast") {
			return box + 'white';
		}
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

	static setTypeAndDifficulty (cards) {
		let cardset_id = "";
		let cardsetData;
		for (let i = 0; i < cards.length; i++) {
			if (cardset_id !== cards[i].cardset_id) {
				cardset_id = cards[i].cardset_id;
				cardsetData = Cardsets.findOne({_id: cardset_id}, {
					fields: {
						cardType: 1,
						difficulty: 1
					}
				});
			}
			cards[i].cardType = cardsetData.cardType;
			cards[i].difficulty = cardsetData.difficulty;
		}
		return cards;
	}

	static removeMarkdeepTags (content) {
		return content
		// Remove image mark-up
			.replace(/[\!][\[]/g, '')
			// Remove inline links
			.replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
			// Remove blockquotes
			.replace(/^\s{0,3}>\s?/g, '')
			// Remove code blocks
			.replace(/(`{3,})(.*?)\1/gm, '$2')
			// Remove inline code
			.replace(/`(.+?)`/g, '$1')
			// Remove rest of mark-up
			.replace(/[\][\$=~`#|*_+-]/g, " ");
	}

	static setTextZoom () {
		let newFontSize = Math.round((defaultFontSize * Session.get('currentZoomValue')) / 100);
		$('.cardContent').css("font-size", newFontSize + "px");
	}

	static resetCurrentTextZoomValue () {
		Session.set('currentZoomValue', defaultTextZoomValue);
		$('.zoomSlider').slider("value", defaultTextZoomValue);
		CardVisuals.setTextZoom();
	}

	static getDefaultTextZoomValue () {
		return defaultTextZoomValue;
	}

	static zoomCardText () {
		$(".zoomSlider").slider({
			orientation: "vertical",
			value: Session.get('currentZoomValue'),
			min: 50,
			max: 300,
			slide: function (event, ui) {
				Session.set('currentZoomValue',ui.value);
				CardVisuals.setTextZoom();
			}
		});
		$('.zoomSlider .ui-slider-handle').unbind('keydown');
	}

	static toggleZoomContainer (forceOff = false) {
		let zoomSliderContainer = $('.zoomSliderContainer');
		if (zoomSliderContainer.length) {
			if (zoomSliderContainer.css('display') === 'none' && forceOff === false) {
				zoomSliderContainer.css('display', 'block');
				Session.set('zoomTextContainerVisible', true);
			} else {
				zoomSliderContainer.css('display', 'none');
				Session.set('zoomTextContainerVisible', false);
			}
			let cardHeader = $('.cardHeader');
			let zoomTextButton = $('.zoomTextButton:visible');
			if (cardHeader.length && zoomTextButton.length) {
				let topPosition = cardHeader.offset().top;
				let leftPosition = zoomTextButton.offset().left - $('#flashcardSidebarRight').width() * 4.5;
				zoomSliderContainer.css({
					'top': topPosition + "px",
					'left': leftPosition + "px"
				});
			}
		}
	}

	static setSidebarPosition () {
		let cardHeaderHeight = $('.cardHeader').height();
		let leftSidebar = $('#flashcardSidebarLeft');
		let rightSidebar = $('#flashcardSidebarRight');
		let leftSidebarElementCount = $('#flashcardSidebarLeft .card-button').length;
		let rightSidebarElementCount = $('#flashcardSidebarRight .card-button').length;
		if (leftSidebarElementCount === 0) {
			leftSidebar.css('display', 'none');
		} else {
			leftSidebar.css('display', 'block');
		}
		if (rightSidebarElementCount === 0) {
			rightSidebar.css('display', 'none');
		} else {
			rightSidebar.css('display', 'block');
		}
		if (Route.isEditMode() && MarkdeepEditor.getMobilePreview()) {
			cardHeaderHeight += $('.mobilePreviewContent .cardToolbar').height() + 15;
			leftSidebar.addClass('flashcardSidebarPreviewLeft');
			rightSidebar.addClass('flashcardSidebarPreviewRight');
		} else {
			leftSidebar.removeClass('flashcardSidebarPreviewLeft');
			rightSidebar.removeClass('flashcardSidebarPreviewRight');
		}
		leftSidebar.css('margin-top', cardHeaderHeight + 'px');
		rightSidebar.css('margin-top', cardHeaderHeight + 'px');
	}
};
