import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Route} from "./route";
import {CardVisuals} from "./cardVisuals";
import {CardEditor} from "./cardEditor";
import {CardIndex} from "./cardIndex";
import {Cards} from "../api/subscriptions/cards";
import {Cardsets} from "../api/subscriptions/cardsets";
import {SweetAlertMessages} from "./sweetAlert";
import {CardType} from "./cardTypes";
import {NavigatorCheck} from "./navigatorCheck";
import * as config from "../config/cardNavigation.js";
import * as pdfViewerConfig from "../config/pdfViewer.js";
import {CardsetNavigation} from "./cardsetNavigation";
import {MainNavigation} from "./mainNavigation";
import {ServerStyle} from "./styles";
import {PDFViewer} from "./pdfViewer";
import {Bonus} from "./bonus";
import {PomodoroTimer} from "./pomodoroTimer";
import {Fullscreen} from "./fullscreen";
import {AnswerUtilities} from "./answers";
import {ErrorReporting} from "./errorReporting";

let keyEventsUnlocked = true;
let lastActiveCardString = "lastActiveCard";
let isReset = false;

export let CardNavigation = class CardNavigation {

	static exitPresentationFullscreen (event) {
		//Is not a mobile device
		if (NavigatorCheck.isSmartphone()) {
			return false;
		}
		//Is view in Fullscreen mode
		if (!Fullscreen.isActive()) {
			return false;
		}
		//Is part of the navigation or card
		if ($(event.target).hasClass('presentation-element') || $(event.target).parents('.presentation-element').length) {
			return false;
		}
		//Is part of a modal
		if ($(event.target).hasClass('modal') || $(event.target).parents('.modal').length) {
			return false;
		}
		//Is part of a sweet alert message
		if ($(event.target).hasClass('swal2-container') || $(event.target).parents('.swal2-container').length) {
			return false;
		}
		//Is part of lightbox
		if ($(event.target).hasClass('swal2-container') || $(event.target).parents('.swal2-container').length) {
			return false;
		}
		//Is part of the zoom container
		if ($(event.target).hasClass('zoomSliderContainer') || $(event.target).parents('.zoomSliderContainer').length) {
			return false;
		} else if ($(event.target).hasClass('resetTextZoom')) {
			CardVisuals.resetCurrentTextZoomValue();
			return false;
		} else if (CardVisuals.isZoomContainerVisible()) {
			CardVisuals.toggleZoomContainer(true);
			return false;
		}
		//Is part of lightbox
		if ($(event.target).hasClass('lightboxOverlay') || $(event.target).parents('.lightboxOverlay').length) {
			return false;
		}
		//Is part of aspect ratio container
		if ($(event.target).hasClass('aspect-ratio-dropdown-button') || $(event.target).parents('.aspect-ratio-dropdown-button').length) {
			Session.set('aspectRatioMode', $(event.target).attr("data-id"));
			CardVisuals.resizeFlashcard();
			CardVisuals.toggleAspectRatioContainer(true);
			return false;
		} else if (CardVisuals.isAspectRatioContainerVisible()) {
			CardVisuals.toggleAspectRatioContainer(true);
			return false;
		}

		if (ServerStyle.exitDemoOnFullscreenBackgroundClick() && Route.isDemo() || Route.isMakingOf()) {
			this.exitPresentation();
		} else if (ServerStyle.exitPresentationOnFullscreenBackgroundClick() && Route.isPresentation()) {
			this.exitPresentation();
		}
	}

	static exitPresentation () {
		CardVisuals.toggleZoomContainer(true);
		CardVisuals.toggleAspectRatioContainer(true);
		if (Route.isMakingOf() || Route.isDemo()) {
			this.exitDemoFullscreenRoute();
		} else if (Route.isPresentationTranscriptPersonal()) {
			FlowRouter.go('transcriptsPersonal');
		} else if (Route.isPresentationTranscriptBonus()) {
			FlowRouter.go('transcriptsBonus');
		} else if (Route.isPresentationTranscriptBonusCardset() || Route.isPresentationTranscriptReview()) {
			FlowRouter.go('transcriptBonus', {
				_id: FlowRouter.getParam('_id')
			});
		} else {
			FlowRouter.go('cardsetdetailsid', {
				_id: FlowRouter.getParam('_id')
			});
		}
	}

	static selectActiveButton () {
		for (let i = 1; i <= this.getCardSideNavigationLength(); i++) {
			if (!this.isButtonDisabled(i)) {
				let button = $(".cardNavigation > li:nth-child(" + i + ") a");
				CardNavigation.switchCardSide(button.data('content-id'), (button.data('navigation-id') + 1), button.data('style'), button.data('side'), false);
				this.selectButton(i, true);
				return;
			}
		}
		this.selectButton();
	}

	static exitDemoFullscreenRoute () {
		if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
			FlowRouter.go('about');
		} else {
			FlowRouter.go('home');
		}
	}

	static selectButton (index = 1) {
		$(".cardNavigation > li:nth-child(" + index + ") a").click();
		Session.set('activeCardSide', index);
	}

	static isButtonDisabled (index = 1) {
		if (Route.isEditMode()) {
			return false;
		} else {
			return $(".cardNavigation > li:nth-child(" + index + ") a").data('disabled') === 1;
		}
	}

	static setSwitchCardSide (contentId, navigationId, cardStyle) {
		CardVisuals.toggleZoomContainer(true);
		CardVisuals.toggleAspectRatioContainer(true);
		CardVisuals.isTextCentered();
		Session.set('dictionaryBeolingus', 0);
		Session.set('dictionaryLinguee', 0);
		Session.set('dictionaryGoogle', 0);
		Session.set('activeCardStyle', cardStyle);
		Session.set('activeCardContentId', contentId);
		this.setActiveNavigationButton(navigationId);
		CardEditor.setEditorContent(navigationId);
	}

	static switchCardSide (contentId, navigationId, cardStyle, cardSide, disableTransition = false) {
		let allowTrigger = true;
		if (!NavigatorCheck.gotFeatureSupport(5) && Session.get('is3DTransitionActive') && Session.get('is3DActive')) {
			allowTrigger = false;
		}
		if (allowTrigger) {
			let enableFirstLoad = Session.get('activeCardContentId') === contentId;
			if (!Session.get('is3DActive') && !CardType.hasCardTwoSides(7, Session.get('cardType')) && !enableFirstLoad) {
				let fadeInOutTime = config.fadeInOutTime;
				$('.card-content-container').fadeOut(fadeInOutTime, function () {
					CardNavigation.setSwitchCardSide(contentId, navigationId, cardStyle);
					$('.card-content-container').fadeIn(fadeInOutTime);
				});
			} else {
				this.setSwitchCardSide(contentId, navigationId, cardStyle);
			}
			if (Session.get('is3DActive')) {
				if (!NavigatorCheck.gotFeatureSupport(5)) {
					Session.set('is3DTransitionActive', 1);
				}
				CardVisuals.rotateCube(cardSide, disableTransition);
			} else if (CardType.hasCardTwoSides(6, Session.get('cardType'))) {
				CardVisuals.flipCard(navigationId - 1);
			}
		}
	}

	static setActiveNavigationButton (index) {
		$('.cardNavigation a').removeClass('card-navigation-active').addClass('switchCardSide');
		$(".cardNavigation > li:nth-child(" + index + ") a").removeClass('switchCardSide').addClass('card-navigation-active');
	}

	static getCubeSidePosition (index) {
		switch (index) {
			case 0:
				return "front";
			case 1:
				return "right";
			case 2:
				return "back";
			case 3:
				return "left";
			case 4:
				return "top";
			case 5:
				return "bottom";
		}
	}

	static filterNavigation (cubeSides, mode = undefined) {
		if (cubeSides === undefined) {
			return [""];
		}
		let filteredSides = [];
		let index = 0;
		for (let i = 0; i < cubeSides.length; i++) {
			if (Session.get('swapAnswerQuestion') && CardType.isCardTypesWithSwapAnswerQuestionButton(Session.get('cardType'))) {
				if (cubeSides[i].isAnswerFocus !== undefined && cubeSides[i].isAnswerFocus === true) {
					cubeSides[i].index = index++;
					filteredSides.push(cubeSides[i]);
				}
			} else {
				if (cubeSides[i].isAnswer === mode) {
					cubeSides[i].index = index++;
					filteredSides.push(cubeSides[i]);
				}
			}
			cubeSides[i].side = this.getCubeSidePosition(i);
		}
		return filteredSides;
	}

	static indexNavigation (cubeSides) {
		if (cubeSides === undefined) {
			return [""];
		}
		let index = 0;
		for (let i = 0; i < cubeSides.length; i++) {
			cubeSides[i].index = index++;
			if (cubeSides[i].isAnswerFocus) {
				Session.set('answerFocus', (i + 1));
			}
			cubeSides[i].side = this.getCubeSidePosition(i);
		}
		return cubeSides;
	}

	static getTabIndex (index, contentEditor = false) {
		let increaseNumber = 0;
		if (contentEditor) {
			increaseNumber = 1;
		}
		switch (index) {
			case 1:
				return 3 + increaseNumber;
			case 2 :
				return 5 + increaseNumber;
			case 3:
				return 7 + increaseNumber;
			case 4 :
				return 9 + increaseNumber;
			case 5 :
				return 11 + increaseNumber;
			case 6 :
				return 13 + increaseNumber;
		}
	}

	static getCardSideNavigationLength () {
		return $(".cardNavigation:first a").length;
	}

	static getCardSideNavigationIndex () {
		return ($(".card-navigation-active").index(".cardNavigation:first a")) + 1;
	}

	static cardSideNavigation (isSpacebarEvent = false) {
		let navigationLength = this.getCardSideNavigationLength();
		let index = this.getCardSideNavigationIndex();
		let editorButtonIndex = CardEditor.getEditorButtons().indexOf(CardEditor.getCardNavigationName());
		let attempts = 0;
		if (index >= navigationLength) {
			if (isSpacebarEvent) {
				CardNavigation.skipAnswer();
				return;
			} else {
				index = 1;
				while (this.isButtonDisabled(index) && attempts <= navigationLength) {
					++index;
					++attempts;
				}
				if (Route.isEditMode() && !Fullscreen.isActive()) {
					++editorButtonIndex;
				}
			}
		} else {
			++index;
			while (this.isButtonDisabled(index) && attempts <= navigationLength) {
				if (index >= navigationLength) {
					if (isSpacebarEvent) {
						CardNavigation.skipAnswer();
						return;
					} else {
						index = 1;
						++attempts;
					}
				} else {
					++index;
					++attempts;
				}
			}
		}
		if (CardEditor.getEditorButtons()[editorButtonIndex] !== CardEditor.getCardNavigationName() && Route.isEditMode() && !Fullscreen.isActive()) {
			CardEditor.setEditorButtonIndex(editorButtonIndex);
		} else {
			this.selectButton(index);
		}
	}

	static switchCard (updateLearningMode = 0, answeredCard = 0, answer = 0, ratingData = [0]) {
		let flashcardCarousel = $('#cardCarousel');
		$('.carousel-inner').removeClass('card-3d-overflow');
		$('.carousel-inner').removeClass('flip-card-overflow');
		flashcardCarousel.on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
			CardNavigation.toggleVisibility(false);
			flashcardCarousel.off('slide.bs.carousel');
		});

		let timestamps = Session.get('leitnerHistoryTimestamps');
		timestamps.submission = new Date();
		Session.set('leitnerHistoryTimestamps', timestamps);

		flashcardCarousel.on('slid.bs.carousel', function () {
			$('.scrollLeft').removeClass('pressed');
			$('.scrollRight').removeClass('pressed');
			CardNavigation.setActiveCardData();
			Session.set('isQuestionSide', true);
			if (updateLearningMode === 1) {
				Meteor.call('setSimpleAnswer', FlowRouter.getParam('_id'), answeredCard, answer, Session.get('leitnerHistoryTimestamps'));
			} else if (updateLearningMode === 2) {
				Meteor.call("updateWozniak", FlowRouter.getParam('_id'), answeredCard, answer);
			} else if (updateLearningMode === 3) {
				Meteor.call("rateTranscript", FlowRouter.getParam('_id'), answeredCard, answer, ratingData);
			}
			setTimeout(function () {
				Session.set('activeCardSide', undefined);
				CardNavigation.toggleVisibility(true);
				flashcardCarousel.off('slid.bs.carousel');
			}, 300);
		});
		ErrorReporting.loadErrorReportingModal();
	}

	static switchCardMc (activeCard) {
		let flashcardCarousel = $('#cardCarousel');
		let timestamps = Session.get('leitnerHistoryTimestamps');
		timestamps.submission = new Date();

		Session.set('selectedAnswers', []);
		flashcardCarousel.on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
			CardNavigation.toggleVisibility(false);
			flashcardCarousel.off('slide.bs.carousel');
		});

		if ($('.carousel-inner > .item').length === 1) {
			CardNavigation.setActiveCardData();
			Meteor.call("nextMCCard", activeCard, FlowRouter.getParam('_id'), timestamps);
		} else {
			flashcardCarousel.on('slid.bs.carousel', function () {
				CardNavigation.setActiveCardData();
				Session.set('isQuestionSide', true);
				Meteor.call("nextMCCard", activeCard, FlowRouter.getParam('_id'), timestamps);
				setTimeout(function () {
					Session.set('activeCardSide', undefined);
					CardNavigation.toggleVisibility(true);
					$('html, body').animate({scrollTop: '0px'}, 300);
					flashcardCarousel.off('slid.bs.carousel');
				}, 300);
			});
		}
		$('.carousel').carousel('next');
		ErrorReporting.loadErrorReportingModal();
	}

	static setActiveCardData (_id = undefined, onlyUpdateCardset = false) {
		if (_id !== undefined) {
			Session.set('activeCard', _id);
		} else if (!onlyUpdateCardset) {
			Session.set('activeCard', $(".item.active").data('id'));
		}
		if (Route.isPresentation() || Route.isCardset()) {
			let lastActiveCard = {
				_id: Session.get('activeCard'),
				cardset_id: FlowRouter.getParam('_id')
			};
			localStorage.setItem(lastActiveCardString, JSON.stringify(lastActiveCard));
		}
		let cardset;
		if (Session.get('activeCard') === -1 || Session.get('activeCard') === undefined || Route.isPresentationTranscript()) {
			if (Route.isDemo()) {
				Session.set('activeCardsetName', Cardsets.findOne({name: "DemoCardset", shuffled: true}).name);
			} else if (Route.isMakingOf()) {
				Session.set('activeCardsetName', Cardsets.findOne({name: "MakingOfCardset", shuffled: true}).name);
			} else if (Route.isPresentationTranscript() || Route.isNewTranscript() || Route.isEditTranscript()) {
				Session.set('activeCardsetName', "");
			} else {
				Session.set('activeCardsetName', Cardsets.findOne({_id: FlowRouter.getParam('_id')}).name);
			}
		} else {
			let cardset_id;
			cardset = Cards.findOne({_id: Session.get('activeCard')}, {fields: {cardset_id: 1}});
			if (cardset !== undefined) {
				if (FlowRouter.getParam('_id') !== undefined) {
					cardset_id = FlowRouter.getParam('_id');
				} else {
					cardset_id = cardset.cardset_id;
				}
			}
			Session.set('activeCardsetName', Cardsets.findOne({_id: cardset_id}).name);
		}
		if (pdfViewerConfig.enabled) {
			let activeCard = Cards.findOne({_id: Session.get('activeCard')}, {fields: {_id: 1, cardType: 1}});
			if (activeCard !== undefined) {
				PDFViewer.setLearningAutoTarget(activeCard._id, activeCard.cardType);
			}
		}
	}

	static restoreActiveCard () {
		if (Route.isPresentation() || Route.isCardset()) {
			if (localStorage.getItem(lastActiveCardString) !== undefined && localStorage.getItem(lastActiveCardString) !== null) {
				let lastActiveCard = JSON.parse(localStorage.getItem(lastActiveCardString));
				if (FlowRouter.getParam('_id') === lastActiveCard.cardset_id && Cards.findOne({_id: lastActiveCard._id})) {
					Session.set('activeCard', lastActiveCard._id);
				} else {
					localStorage.removeItem(lastActiveCardString);
				}
			}
		}
	}

	static isVisible () {
		return Session.get('navigationVisible');
	}

	static toggleVisibility (status) {
		if (CardIndex.getCardIndex().length > 1) {
			Session.set('navigationVisible', status);
		} else {
			Session.set('navigationVisible', true);
		}
	}

	static resetNavigation () {
		isReset = true;
		this.toggleVisibility(false);
	}

	static checkIfReset () {
		if (isReset) {
			isReset = false;
			this.toggleVisibility(true);
		}
	}

	static skipAnswer (scrollRight = true) {
		if (Route.isBox()) {
			let skippedCard = $('.carousel-inner > .active').attr('data-id');
			Meteor.call('skipLeitnerCard', skippedCard, FlowRouter.getParam('_id'));
		}
		if (scrollRight) {
			$('.scrollRight').addClass('pressed');
			$('.carousel').carousel('next');
		} else {
			$('.scrollLeft').addClass('pressed');
			$('.carousel').carousel('prev');
		}
		Session.set('selectedAnswers', []);
		this.toggleVisibility(false);
		this.switchCard();
	}

	static answerCard (updateLearningMode, answer, ratingData = [0]) {
		let answeredCard = $('.carousel-inner > .active').attr('data-id');
		Session.set('isQuestionSide', false);
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
		if (updateLearningMode === 2) {
			answer = $(answer.currentTarget).data("id");
		}
		if ($('.carousel-inner > .item').length === 1) {
			if (updateLearningMode === 1) {
				let timestamps = Session.get('leitnerHistoryTimestamps');
				timestamps.submission = new Date();
				Meteor.call('setSimpleAnswer', FlowRouter.getParam('_id'), answeredCard, answer, timestamps);
			} else if (updateLearningMode === 2) {
				Meteor.call("updateWozniak", FlowRouter.getParam('_id'), answeredCard, answer);
			} else if (updateLearningMode === 3) {
				Meteor.call("rateTranscript", FlowRouter.getParam('_id'), answeredCard, answer, ratingData);
			}
		} else {
			this.toggleVisibility(false);
			this.switchCard(updateLearningMode, answeredCard, answer, ratingData);
		}
	}

	static rateLeitner (answer) {
		this.answerCard(1, answer);
	}

	static rateTranscript (answer, ratingData = [0]) {
		this.answerCard(3, answer, ratingData);
	}

	static fullscreenExitEvents () {
		document.onfullscreenchange = function () {
			if (document.fullscreenElement === null && Session.get('fullscreen')) {
				if (Route.isPresentation()) {
					SweetAlertMessages.continuePresentation();
				} else if ((Route.isBox() && !Bonus.isInBonus(FlowRouter.getParam('_id'))) || Route.isMemo()) {
					SweetAlertMessages.activateFullscreen();
				} else if (Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id')) && !PomodoroTimer.isTransitionRequest()) {
					SweetAlertMessages.activateFullscreen();
				} else {
					$(".toggleFullscreen").click();
				}
			}
		};
	}

	static rateWozniak (answer) {
		this.answerCard(2, answer);
	}

	static scrollCardContent (scrollDown = true) {
		let scrollValue = 30;
		if (!scrollDown) {
			scrollValue = -1 * scrollValue;
		}
		let cardContent = $('.active .cardContent');
		cardContent.scrollTop(cardContent.scrollTop() + scrollValue);
	}

	static isMobileView () {
		return Session.get('windowWidth') <= 1200;
	}

	static isFirstCard () {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.indexOf(Session.get('activeCard')) === 0;
	}

	static isLastCard () {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.indexOf(Session.get('activeCard')) === cardIndex.length - 1;
	}

	static enableKeyEvents () {
		keyEventsUnlocked = true;
	}

	static keyEvents (event) {
		let keyCodes = [];

		CardVisuals.toggleZoomContainer(true);
		CardVisuals.toggleAspectRatioContainer(true);
		if (!$('.input-search').is(":focus") && !$('#lightbox').is(":visible") && !$('.modal').is(":visible") && keyEventsUnlocked) {
			keyEventsUnlocked = false;
			if (Route.isEditMode() && !(Session.get('fullscreen') && Fullscreen.isEditorFullscreenActive() === false)) {
				if ($('#subjectEditor').is(":focus")) {
					keyCodes = [9, 13];
				} else if ($('.learningGoalLevelButton').is(":focus")) {
					keyCodes = [9, 13, 37, 39];
				} else {
					keyCodes = [9];
				}
			} else if (Route.isPresentationOrDemo() || Route.isLearningMode() || Route.isPresentationTranscript()) {
				keyCodes = [9, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 78, 89, 90, 96, 97, 98, 99, 100, 101];
			}
			const F2KEY = 113;
			if (Route.gotIndexHotkey()) {
				if (keyCodes.indexOf(F2KEY) === -1) {
					keyCodes.push(F2KEY);
				}
			} else {
				keyCodes = keyCodes.filter(
					function (key) {
						return key !== F2KEY;
					});
			}
			if (keyCodes.indexOf(event.keyCode) > -1) {
				switch (event.keyCode) {
					case 9:
						if (Route.isEditMode()) {
							if (Session.get('isDeepLModalVisible')) {
								$('#cardModalBeolingusTranslation').modal('hide');
							} else {
								CardEditor.setEditorButtonFocus();
							}
						} else {
							if (CardType.gotDictionary(Session.get('cardType'))) {
								if (Session.get('isDeepLModalVisible')) {
									$('#cardModalBeolingusTranslation').modal('hide');
								} else {
									$('#cardModalBeolingusTranslation').modal('show').one('hidden.bs.modal', function () {
										CardNavigation.cardSideNavigation();
									});
								}
							} else {
								CardNavigation.cardSideNavigation();
							}
						}
						break;
					case 13:
						CardEditor.setEditorButtonFocus();
						break;
					case 32:
						if (CardNavigation.isVisible()) {
							if (Route.isCardset() || Route.isPresentationOrDemo()) {
								if (CardNavigation.getCardSideNavigationIndex() < CardNavigation.getCardSideNavigationLength()) {
									if (Route.isPresentationTranscriptReview() && CardNavigation.getCardSideNavigationIndex() === CardNavigation.getCardSideNavigationLength() - 1) {
										Session.set('isQuestionSide', false);
									}
									CardNavigation.cardSideNavigation(true);
								} else if (!CardNavigation.isLastCard() && !Route.isPresentationTranscriptReview()) {
									CardNavigation.skipAnswer();
								}
							} else if ((Route.isBox() || Route.isMemo()) && Session.get('isQuestionSide')) {
								CardNavigation.skipAnswer();
							}
						}
						break;
					case 37:
						if (Route.isEditMode() && !Fullscreen.isActive()) {
							CardEditor.setLearningGoalLevelIndex(false);
						} else if (!Route.isEditMode() && !(!config.allowIndexWrap && CardNavigation.isFirstCard())) {
							if (CardNavigation.isVisible() && !Route.isBox() && !Route.isMemo()) {
								if ($('#leftCarouselControl').click()) {
									$('#showHintModal').modal('hide');
									$('body').removeClass('modal-open');
									$('.modal-backdrop').remove();
								}
								if (Session.get('isQuestionSide')) {
									CardNavigation.skipAnswer(false);
								}
							}
						}
						break;
					case 38:
						CardNavigation.scrollCardContent(false);
						break;
					case 39:
						if (Route.isEditMode() && !Fullscreen.isActive()) {
							CardEditor.setLearningGoalLevelIndex();
						} else if (!Route.isEditMode() && !(!config.allowIndexWrap && CardNavigation.isLastCard())) {
							if (CardNavigation.isVisible() && !Route.isBox() && !Route.isMemo()) {
								if ($('#rightCarouselControl').click()) {
									$('#showHintModal').modal('hide');
									$('body').removeClass('modal-open');
									$('.modal-backdrop').remove();
								}
								if (Session.get('isQuestionSide')) {
									CardNavigation.skipAnswer();
								}
							}
						}
						break;
					case 40:
						CardNavigation.scrollCardContent();
						break;
					case 48:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 49:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate1').click();
						}
						break;
					case 50:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate2').click();
						}
						break;
					case 51:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate3').click();
						}
						break;
					case 52:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate4').click();
						}
						break;
					case 53:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate5').click();
						}
						break;
					case 78:
						if (!Session.get('isQuestionSide')) {
							if (Route.isTranscript()) {
								$('#denyTranscript').click();
							} else {
								$('#notknown').click();
							}
						}
						break;
					case 89:
						if (!Session.get('isQuestionSide')) {
							if (Route.isTranscript()) {
								$('#acceptTranscript').click();
							} else if (AnswerUtilities.gotLeitnerMcEnabled()) {
								$('#nextMCCard').click();
							} else {
								$('#known').click();
							}
						} else {
							if (Route.isTranscript()) {
								$('#rateTranscript').click();
							} else if (AnswerUtilities.gotLeitnerMcEnabled()) {
								$('#learnSendAnswer').click();
							} else {
								$('#learnShowAnswer').click();
							}
						}
						break;
					case 90:
						if (!Session.get('isQuestionSide')) {
							$('#known').click();
						} else {
							$('#learnShowAnswer').click();
						}
						break;
					case 96:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 97:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate1').click();
						}
						break;
					case 98:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate2').click();
						}
						break;
					case 99:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate3').click();
						}
						break;
					case 100:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate4').click();
						}
						break;
					case 101:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate5').click();
						}
						break;
					case F2KEY:
						CardsetNavigation.goToIndex();
						break;
				}
				event.preventDefault();
			}
		}
	}
};
