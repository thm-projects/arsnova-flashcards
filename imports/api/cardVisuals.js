import {Session} from "meteor/session";
import {Route} from "./route";
import {CardType} from "./cardTypes";
import * as screenfull from 'screenfull';
import {NavigatorCheck} from "./navigatorCheck";
import {Cardsets} from "./cardsets";
import {MarkdeepEditor} from "./markdeepEditor";
import {AspectRatio} from "./aspectRatio.js";
import * as config from "../config/cardVisuals.js";

let editorFullScreenActive = false;
let lastActiveRotation;

export let CardVisuals = class CardVisuals {

	static isEditorFullscreen () {
		return editorFullScreenActive;
	}

	static isFixedSidebar () {
		let mode = 0;
		if (Route.isPresentation()) {
			mode = 1;
		} else if (Route.isDemo() || Route.isMakingOf()) {
			mode = 2;
		} else if (Route.isEditMode()) {
			mode = 3;
		} else if (Route.isBox()) {
			mode = 4;
		} else if (Route.isMemo()) {
			mode = 5;
		}
		return config.fixedSidebarPosition.includes(mode);
	}

	static routeGot3DModeSupport () {
		let mode = 0;
		if (Route.isPresentation()) {
			mode = 1;
		} else if (Route.isDemo() || Route.isMakingOf()) {
			mode = 2;
		} else if (Route.isEditMode()) {
			mode = 3;
		} else if (Route.isBox()) {
			mode = 4;
		} else if (Route.isMemo()) {
			mode = 5;
		}
		return mode;
	}

	static got3DMode () {
		if (Route.isEditMode() && Session.get('mobilePreview'))  {
			return false;
		}
		return config.got3DMode.includes(this.routeGot3DModeSupport());
	}


	static setDefaultViewingMode () {
		if (config.enabled3DModeByDefault.includes(this.routeGot3DModeSupport()) && this.got3DMode() && NavigatorCheck.gotFeatureSupport(4) && !Session.get('forcedAspectRatio')) {
			Session.set('is3DActive', 1);
		} else {
			Session.set('is3DActive', 0);
			Session.set('forcedAspectRatio', 0);
		}
	}

	static isFullscreen () {
		return Session.get('fullscreen');
	}

	static isScreenfullActive () {
		if (NavigatorCheck.isIOS()) {
			return true;
		} else {
			return screenfull.isFullscreen;
		}
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

	static resizeFlaschardCustom (aspectRatio) {
		let flashcard = $('.flashcard');
		let flashcardHeader = $('.cardHeader');
		let flashcardBody = $('.cardContent');
		//The number at the end is for the bottom margin of the card
		let offsetBottom = 15;
		let footerNavigation = $('#navbar-cards-footer');
		if (footerNavigation.length) {
			offsetBottom += footerNavigation.outerHeight() + 10;
		}
		let availableHeight = $(window).height() - flashcard.offset().top - offsetBottom;
		let availableWidth = $('#cardCarousel').width();
		let newHeight = availableHeight;
		let newWidth = availableWidth;
		if (aspectRatio !== "fill") {
			let ratio = aspectRatio.split(":");
			if (aspectRatio === "din") {
				ratio = "148:105".split(":");
			} else {
				ratio = aspectRatio.split(":");
			}
			newHeight = (newWidth / parseInt(ratio[0])) * (parseInt(ratio[1]));
			if (newHeight >= availableHeight) {
				newHeight = availableHeight;
				newWidth = (newHeight / parseInt(ratio[1])) * (parseInt(ratio[0]));
			}
		}
		let flashcardHeaderHeight = 90;
		flashcard.css('width', newWidth);
		flashcard.css('height', newHeight);
		let leftOffset = (availableWidth - newWidth) / 2;
		if (aspectRatio !== "fill") {
			flashcard.css('margin-left', leftOffset);
			if (Session.get('is3DActive')) {
				flashcard.css('margin-right', leftOffset);
			}
		}

		flashcardHeader.css('height', flashcardHeaderHeight);
		flashcardBody.css('height', newHeight - flashcardHeaderHeight);
		if (AspectRatio.scaleCardNavigationWidth()) {
			let cardNavigation = $('.cardNavigation');
			let answerOptions = $('#answerOptions');
			cardNavigation.css('width', newWidth);
			cardNavigation.css('margin-left', leftOffset);
			if (answerOptions.length) {
				answerOptions.css('width', newWidth);
				answerOptions.css('margin-left', leftOffset);
			}
		}
		$('.aspect-ratio-dropdown-button').removeClass('active');
		$('.aspect-ratio-dropdown-button[data-id="' + aspectRatio + '"]').addClass('active');
	}

	static rotateCube (cardSide = "front", disableTransition = false) {
		let height = $('.flashcard').outerHeight();
		let cube = $('.scene.active #cube');
		let transition = "";
		if (disableTransition) {
			transition =  " transition: transform 0s !important; ";
		} else {
			transition =  " transition: transform " + config.cubeTransitionTime + "s !important; ";
		}
		if (!NavigatorCheck.gotFeatureSupport(5)) {
			if (lastActiveRotation === cardSide || disableTransition) {
				Session.set('is3DTransitionActive', 0);
			}
		}
		lastActiveRotation = cardSide;
		switch (cardSide) {
			case "front":
				cube.attr('style', 'transform: translateZ(' + (-height / 2) + 'px) rotateY(   0deg); ' + transition + 'height: ' + height + 'px !important; width: ' + height + 'px !important;');
				break;
			case "back":
				cube.attr('style', 'transform: translateZ(' + (-height / 2) + 'px) rotateY(   -180deg);  ' + transition + 'height: ' + height + 'px !important; width: ' + height + 'px !important;');
				break;
			case "left":
				cube.attr('style', 'transform: translateZ(' + (-height / 2) + 'px) rotateY(   -270deg);  ' + transition + 'height: ' + height + 'px !important; width: ' + height + 'px !important;');
				break;
			case "right":
				cube.attr('style', 'transform: translateZ(' + (-height / 2) + 'px) rotateY(   -90deg);  ' + transition + 'height: ' + height + 'px !important; width: ' + height + 'px !important;');
				break;
			case "top":
				cube.attr('style', 'transform: translateZ(' + (-height / 2) + 'px) rotateX(   -90deg);  ' + transition + 'height: ' + height + 'px !important; width: ' + height + 'px !important;');
				break;
			case "bottom":
				cube.attr('style', 'transform: translateZ(' + (-height / 2) + 'px) rotateX(   90deg);  ' + transition + 'height: ' + height + 'px !important; width: ' + height + 'px !important;');
				break;
		}
	}

	static resizeFlashcard3D () {
		let offsetBottom = 45;
		let cardNavigation = $('.cardNavigation');
		let availableHeight = $(window).height() - (cardNavigation.outerHeight() + cardNavigation.offset().top)  - offsetBottom;
		let flashcard = $('.flashcard');
		let flashcardHeader = $('.cardHeader');
		let flashcardBody = $('.cardContent');
		flashcard.css('width', availableHeight * 0.9);
		flashcard.css('height', availableHeight  * 0.9);
		let carousel = $('.carousel-inner');
		let offset = (carousel.width() - flashcard.outerHeight()) / 2;
		let flashcardHeaderHeight = 90;
		flashcardBody.css('height', flashcard.innerHeight() - flashcardHeaderHeight);
		flashcardHeader.css('height', flashcardHeaderHeight);
		$('.carousel-inner > .item').attr('style', 'padding-left: ' + offset + 'px !important; padding-right: ' + offset + 'px !important; height: ' + flashcard.outerHeight() + 'px !important; width: ' + carousel.width()   +  'px !important; margin-top: ' + availableHeight * 0.05 + 'px !important;');
		$('.scene.active').attr('style', 'perspective: ' + flashcard.outerHeight() * 2 + 'px; height: ' + flashcard.outerHeight() + 'px !important; width: ' + carousel.width()  + 'px !important; margin-top: ' + availableHeight * 0.05 + 'px !important; margin-bottom: ' + availableHeight * 0.05 + 'px !important; padding-left: ' + offset + 'px !important; padding-right: ' + offset + 'px !important;');
		$('.cube-face-front').attr('style', 'transform: rotateY(  0deg) translateZ(' + (flashcard.outerHeight() / 2) + 'px); height: ' + flashcard.outerHeight() + 'px !important; width: ' + flashcard.outerHeight() + 'px !important;');
		$('.cube-face-right').attr('style', 'transform: rotateY( 90deg) translateZ(' + (flashcard.outerHeight() / 2) + 'px); height: ' + flashcard.outerHeight() + 'px !important; width: ' + flashcard.outerHeight() + 'px !important;');
		$('.cube-face-back').attr('style', 'transform: rotateY(180deg) translateZ(' + (flashcard.outerHeight() / 2) + 'px); height: ' + flashcard.outerHeight() + 'px !important; width: ' + flashcard.outerHeight() + 'px !important;');
		$('.cube-face-left').attr('style', 'transform: rotateY(-90deg) translateZ(' + (flashcard.outerHeight() / 2) + 'px); height: ' + flashcard.outerHeight() + 'px !important; width: ' + flashcard.outerHeight() + 'px !important;');
		$('.cube-face-top').attr('style', 'transform: rotateX( 90deg) translateZ(' + (flashcard.outerHeight() / 2) + 'px); height: ' + flashcard.outerHeight() + 'px !important; width: ' + flashcard.outerHeight() + 'px !important;');
		$('.cube-face-bottom').attr('style', 'transform: rotateX(-90deg) translateZ(' + (flashcard.outerHeight() / 2) + 'px); height: ' + flashcard.outerHeight() + 'px !important; width: ' + flashcard.outerHeight() + 'px !important;');
		this.rotateCube(lastActiveRotation, true);
		let adjustNavigation = true;
		if (Route.isEditMode() && !this.isFullscreen()) {
			$('#contentEditor').css('height', $('.scene').height() - $('#editorButtonGroup').height());
			adjustNavigation = false;
		}
		if (AspectRatio.scale3DCardNavigationWidth()) {
			if (adjustNavigation) {
				let leftMargin = ($(window).width() - flashcard.width()) / 2;
				if (leftMargin < 0) {
					leftMargin = 0;
				} else {
					leftMargin -= parseInt($('.cardNavigation').parent().css('padding-left'));
				}
				$('.cardNavigation').attr('style', 'max-width: ' + flashcard.width() + 'px !important; margin-left: ' +  leftMargin + 'px !important;');
			}
		}
	}

	static resizeFlaschardLegacy () {
		let contentEditor = $('#contentEditor');
		let newFlashcardSize;
		let flashcard = $('.flashcard');
		let flashcardHeader = $('.cardHeader');
		let flashcardBody = $('.cardContent');
		let flashcardLecture = $('.cardContentCollapsed');
		let flashcardControls = $('.carousel-control');
		let flashcardHeaderHeight = 0;
		let flashcardBodyHeight = 0;
		Session.set('windowWidth', $(window).width());
		if (NavigatorCheck.isSmartphone() || Session.get('mobilePreview') || Session.get('fullscreen')) {
			if (Session.get('mobilePreview')) {
				if ($(window).width() >= 1200) {
					newFlashcardSize = $(window).height() - (flashcard.offset().top  + $('#editorButtonGroup').innerHeight());
				}
			} else {
				newFlashcardSize = $(window).height() - (flashcard.offset().top + 10);
			}
			if (!NavigatorCheck.isSmartphone() && !Session.get('mobilePreview')) {
				flashcardHeaderHeight = 100;
			} else {
				flashcardHeaderHeight = 60;
			}
			newFlashcardSize -= $('.cardNavigationContainer:visible').outerHeight();
			flashcardBodyHeight = newFlashcardSize - flashcardHeaderHeight;
			flashcard.css('height', newFlashcardSize);
			flashcardHeader.css('height', flashcardHeaderHeight);
			flashcardBody.css('height', flashcardBodyHeight);
			flashcardLecture.css('height', flashcardBodyHeight);
			flashcardControls.css('margin-top', flashcardHeaderHeight);
			flashcardControls.css('height', flashcardBodyHeight);
			contentEditor.css('height', flashcardBodyHeight);
		} else {
			newFlashcardSize = flashcard.width() / Math.sqrt(2);
			flashcard.css('height', newFlashcardSize);
			if (flashcard.width() > 900) {
				flashcardHeaderHeight = 0.12;
				flashcardBodyHeight = 0.88;
				flashcardHeader.css('height', newFlashcardSize * flashcardHeaderHeight);
				flashcardBody.css('height', newFlashcardSize * flashcardBodyHeight);
				flashcardLecture.css('height', newFlashcardSize * flashcardBodyHeight);
				flashcardControls.css('margin-top', newFlashcardSize * flashcardHeaderHeight);
				flashcardControls.css('height', newFlashcardSize * flashcardBodyHeight);
			} else {
				flashcardHeaderHeight = 0.16;
				flashcardBodyHeight = 0.84;
				flashcardHeader.css('height', newFlashcardSize * flashcardHeaderHeight);
				flashcardBody.css('height', newFlashcardSize * flashcardBodyHeight);
				flashcardLecture.css('height', newFlashcardSize * flashcardBodyHeight);
				flashcardControls.css('margin-top', newFlashcardSize * flashcardHeaderHeight);
				flashcardControls.css('height', newFlashcardSize * flashcardBodyHeight);
			}
		}
		if (Session.get('mobilePreview')) {
			newFlashcardSize -= 48;
			if (!Session.get('fullscreen') && $(window).width() > 1200 && Session.get('mobilePreviewRotated')) {
				flashcard.css('height', newFlashcardSize);
				flashcardBody.css('height', newFlashcardSize - flashcardHeaderHeight);
				newFlashcardSize += $('.mobilePreviewContent .cardNavigation').height() + 32;
				$('.mobilePreviewContent').css('height', newFlashcardSize);
				$('.mobilePreviewFrame').css('height', newFlashcardSize + (parseInt($('.mobilePreviewFrame').css('border-top-width'), 10) * 2));
				newFlashcardSize -= 25;
			} else {
				newFlashcardSize += 5;
				$('.mobilePreviewContent').removeAttr('style');
				$('.mobilePreviewFrame').removeAttr('style');
				flashcard.removeAttr('style');
				flashcardBody.removeAttr('style');
			}
			contentEditor.css('height', newFlashcardSize);
		} else {
			contentEditor.css('height', newFlashcardSize - $('#markdeepNavigation').height());
		}
	}

	static resizeFlashcard () {
		let flashcard = $('.flashcard');
		let flashcardHeader = $('.cardHeader');
		let flashcardBody = $('.cardContent');
		let contentEditor = $('#contentEditor');
		if (editorFullScreenActive) {
			contentEditor.css('height', $(window).height() - contentEditor.offset().top - 25);
		} else {
			let aspectRatioEnabled = false;
			if (flashcard.length && flashcardHeader.length && flashcardBody.length) {
				flashcard.removeAttr('style');
				flashcardHeader.removeAttr('style');
				flashcardBody.removeAttr('style');
				contentEditor.removeAttr('style');
				$('.cardNavigation').removeAttr('style');
				$('#answerOptions').removeAttr('style');
				if (AspectRatio.isEnabled()) {
					aspectRatioEnabled = true;
				}
				if (!Session.get('is3DActive') && aspectRatioEnabled &&  !NavigatorCheck.isSmartphone()) {
					switch (Session.get('aspectRatioMode')) {
						case "din":
							this.resizeFlaschardCustom("din");
							break;
						case "fill":
							this.resizeFlaschardCustom("fill");
							break;
						default:
							this.resizeFlaschardCustom(Session.get('aspectRatioMode'));
							break;
					}
				} else {
					if (Session.get('is3DActive')) {
						this.resizeFlashcard3D();
					} else {
						this.resizeFlaschardLegacy();
					}
				}
				this.setSidebarPosition();
				this.setMaxIframeHeight();
				this.setTextZoom();
				this.setPomodoroTimerSize();
			}
		}
	}

	static setMaxIframeHeight () {
		let flashcardBody = $('.cardContent');
		if (flashcardBody.length) {
			let aspectRatioHeight = (flashcardBody.width() / config.iFrameWidthRatio) * config.iFrameHeightRatio;
			if (flashcardBody.height() < aspectRatioHeight) {
				let newIframeWidth = ((aspectRatioHeight * config.iFrameMaxHeight) / config.iFrameHeightRatio) * config.iFrameWidthRatio;
				$('.cardContent .responsive-iframe-container').css('width', newIframeWidth);
			} else {
				$('.cardContent .responsive-iframe-container').css('width', 'unset');
			}
		}
	}

	static setPomodoroTimerSize () {
		let pomodoroTimer = $('.pomodoroClock');
		let flashcardHeader = $('.cardHeader');
		let flashcardHeaderLeft = $('.cardHeaderLeft');
		if (pomodoroTimer.length && flashcardHeader.length && flashcardHeaderLeft.length) {
			let newTimerSize = parseInt(flashcardHeader.height()) - ((parseInt(flashcardHeaderLeft.css('padding-top'))) * 2);
			pomodoroTimer.css('height', newTimerSize + "px");
			pomodoroTimer.css('width', newTimerSize + "px");
			pomodoroTimer.css('margin-top', -parseInt(flashcardHeader.css('padding-top')) + "px");
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
			$("#theme-wrapper").removeClass('theme-wrapper-fullscreen');
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
			this.resizeFlashcard();
		} else {
			if (!NavigatorCheck.isIOS()) {
				screenfull.request();
			}
			$(".box").removeClass("disableCardTransition");
			$("#theme-wrapper").addClass('theme-wrapper-fullscreen');
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
			this.resizeFlashcard();
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

	static isLeftAlign (contentId, alignType) {
		if (alignType === undefined) {
			return false;
		}
		--contentId;
		if (Route.isEditMode()) {
			return Session.get('alignType')[contentId] === 0;
		} else {
			return alignType[contentId] === 0;
		}
	}

	static getCardSideColor (difficulty, cardType, backgroundStyle, activeCard, forceSide) {
		let box = "box-";
		let style;
		if (Session.get('theme') === "contrast") {
			return box + 'white';
		}
		if (activeCard) {
			if (forceSide) {
				style = CardType.getContentStyle(cardType, forceSide);
			} else {
				style = Session.get('activeCardStyle');
			}
		} else {
			let cubeSides = CardType.getCardTypeCubeSides(cardType);
			style = CardType.getActiveSideData(cubeSides, cardType, 1);
		}
		if (style === "default") {
			if (!CardType.gotDifficultyLevel(cardType)) {
				if (backgroundStyle === 0) {
					return box + 'difficultyLined0';
				} else {
					return box + 'difficultyBlank0';
				}
			}
			if (backgroundStyle === 0) {
				switch (difficulty) {
					case 0:
						if (CardType.gotNotesForDifficultyLevel(cardType)) {
							return box + 'difficultyLinedNote0';
						} else {
							return box + 'difficultyLined0';
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
						} else {
							return box + 'difficultyBlank0';
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
		if (cards !== undefined) {
			if (Route.isTranscript()) {
				cards[0].cardType = 2;
				cards[0].difficulty = 0;
				cards[0].cardset_id = -1;
				return cards;
			} else {
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
		} else {
			return [];
		}
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
		let fontSize;
		if (NavigatorCheck.isSmartphone() || (Route.isEditMode() && MarkdeepEditor.getMobilePreview())) {
			if ((NavigatorCheck.isLandscape() && NavigatorCheck.isSmartphone()) || (Route.isEditMode() && Session.get('mobilePreviewRotated') === 0)) {
				fontSize = config.defaultFontSize.landscape.mobile;
			} else {
				fontSize = config.defaultFontSize.portrait.mobile;
			}
		} else {
			if (NavigatorCheck.isTablet()) {
				if (NavigatorCheck.isLandscape()) {
					if (Session.get('is3DActive')) {
						fontSize = config.defaultFontSize.landscape.tablet.cube;
					} else {
						fontSize = config.defaultFontSize.landscape.tablet.normal;
					}
				} else {
					if (Session.get('is3DActive')) {
						fontSize = config.defaultFontSize.portrait.tablet.cube;
					} else {
						fontSize = config.defaultFontSize.portrait.tablet.normal;
					}
				}
			} else {
				if (NavigatorCheck.isLandscape()) {
					if (Session.get('is3DActive')) {
						fontSize = config.defaultFontSize.landscape.desktop.cube;
					} else {
						fontSize = config.defaultFontSize.landscape.desktop.normal;
					}
				} else {
					if (Session.get('is3DActive')) {
						fontSize = config.defaultFontSize.portrait.desktop.cube;
					} else {
						fontSize = config.defaultFontSize.portrait.desktop.normal;
					}
				}
			}
		}
		let newFontSize = Math.round((fontSize * Session.get('currentZoomValue')) / 100);
		$('.cardContent').css("font-size", newFontSize + "px");
	}

	static resetCurrentTextZoomValue () {
		Session.set('currentZoomValue', config.defaultTextZoomValue);
		$('.zoomSlider').slider("value", config.defaultTextZoomValue);
		CardVisuals.setTextZoom();
	}

	static getDefaultTextZoomValue () {
		return config.defaultTextZoomValue;
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
				let topPosition;
				let rightPosition = $('#flashcardSidebarRight').outerWidth();
				if (Route.isCardset() && this.isFixedSidebar()) {
					topPosition = zoomTextButton.offset().top;
				} else {
					topPosition = cardHeader.offset().top;
				}
				if ((NavigatorCheck.isSmartphone() && !NavigatorCheck.isLandscape()) || (Route.isEditMode() && MarkdeepEditor.getMobilePreview() && Session.get('mobilePreviewRotated'))) {
					topPosition += ($('.cardContent').height() - zoomSliderContainer.innerHeight());
				}
				zoomSliderContainer.css({
					'top': topPosition + "px",
					'right': rightPosition + "px"
				});
			}
		}
	}

	static toggleAspectRatioContainer (forceOff = false) {
		let aspectRatioContainer = $('.aspectRatioContainer');
		if (aspectRatioContainer.length) {
			if (aspectRatioContainer.css('display') === 'none' && forceOff === false) {
				aspectRatioContainer.css('display', 'block');
				Session.set('aspectRatioContainerVisible', true);
			} else {
				aspectRatioContainer.css('display', 'none');
				Session.set('aspectRatioContainerVisible', false);
			}
			let aspectRatioButton = $('.aspect-ratio-button');
			if (aspectRatioButton.length) {
				let topPosition = aspectRatioButton.offset().top;
				let rightPosition = $('#flashcardSidebarRight').width();
				aspectRatioContainer.css({
					'top': topPosition + "px",
					'right': rightPosition + "px"
				});
			}
		}
	}

	static setSidebarPosition () {
		let cardHeight = $('.cardHeader').height();
		if (NavigatorCheck.isSmartphone() || (Route.isEditMode() && MarkdeepEditor.getMobilePreview())) {
			cardHeight += $('.cardContent').height();
		}
		let leftSidebar = $('#flashcardSidebarLeft');
		let rightSidebar = $('#flashcardSidebarRight');
		let bottomLeftSidebar = $('#flashcardSidebarBottomLeft');
		let leftSidebarElementCount = $('#flashcardSidebarLeft .card-button').length;
		let rightSidebarElementCount = $('#flashcardSidebarRight .card-button').length;
		let bottomLeftSidebarCount = $('#flashcardSidebarBottomLeft .card-button').length;
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
		if (bottomLeftSidebarCount === 0) {
			bottomLeftSidebar.css('display', 'none');
		}
		if (Route.isEditMode() && MarkdeepEditor.getMobilePreview()) {
			cardHeight += $('.mobilePreviewContent .cardToolbar').height() - 15;
			leftSidebar.addClass('flashcardSidebarPreviewLeft');
			rightSidebar.addClass('flashcardSidebarPreviewRight');
		} else {
			leftSidebar.removeClass('flashcardSidebarPreviewLeft');
			rightSidebar.removeClass('flashcardSidebarPreviewRight');
		}
		if ((NavigatorCheck.isSmartphone()) || (Route.isEditMode() && MarkdeepEditor.getMobilePreview())) {
			leftSidebar.css('margin-top', (cardHeight - (leftSidebar.height() + parseInt(leftSidebar.css('margin-bottom')))) + 'px');
			rightSidebar.css('margin-top', (cardHeight - (rightSidebar.height() + parseInt(rightSidebar.css('margin-bottom')))) + 'px');
		} else {
			if (Session.get('is3DActive')) {
				let sceneMargin = $('.scene.active').css('margin-top');
				leftSidebar.css('margin-top', (cardHeight  + parseInt(sceneMargin)) + 'px');
				rightSidebar.css('margin-top', (cardHeight + parseInt(sceneMargin)) + 'px');
			} else {
				leftSidebar.css('margin-top', (cardHeight) + 'px');
				rightSidebar.css('margin-top', (cardHeight) + 'px');
			}
			bottomLeftSidebar.css('margin-top', (cardHeight + $('.cardContent').height()  - bottomLeftSidebar.height() / 2) + 'px');
		}
	}
};
