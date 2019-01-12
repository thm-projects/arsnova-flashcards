import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Route} from "./route";
import {CardVisuals} from "./cardVisuals";
import {CardEditor} from "./cardEditor";
import * as screenfull from "screenfull";
import {CardIndex} from "./cardIndex";
import {Cards} from "./cards";
import {Cardsets} from "./cardsets";
import {SweetAlertMessages} from "./sweetAlert";
import {CardType} from "./cardTypes";
import {NavigatorCheck} from "./navigatorCheck";

let keyEventsUnlocked = true;
let lastActiveCardString = "lastActiveCard";
let isReset = false;

export let CardNavigation = class CardNavigation {

	static selectButton (index = 1) {
		$(".cardNavigation > li:nth-child(" + index + ") a").click();
	}

	static switchCardSide (contentId, navigationId, cardStyle, cardSide) {
		let allowTrigger = true;
		if (!NavigatorCheck.gotFeatureSupport(5) && Session.get('is3DTransitionActive') && Session.get('is3DActive')) {
			allowTrigger = false;
		}
		if (allowTrigger) {
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
			if (Session.get('is3DActive')) {
				if (!NavigatorCheck.gotFeatureSupport(5)) {
					Session.set('is3DTransitionActive', 1);
				}
				CardVisuals.rotateCube(cardSide);
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

	static cardSideNavigation (forward = true) {
		let navigationLength = this.getCardSideNavigationLength();
		let index = this.getCardSideNavigationIndex();
		let editorButtonIndex = CardEditor.getEditorButtons().indexOf(CardEditor.getCardNavigationName());
		if (forward) {
			if (index >= navigationLength) {
				index = 1;
				if (Route.isEditMode() && !CardVisuals.isFullscreen()) {
					++editorButtonIndex;
				}
			} else {
				++index;
			}
		} else {
			if (index <= 1) {
				index = navigationLength;
				if (Route.isEditMode() && !CardVisuals.isFullscreen()) {
					--editorButtonIndex;
				}
			} else {
				--index;
			}
		}
		if (CardEditor.getEditorButtons()[editorButtonIndex] !== CardEditor.getCardNavigationName() && Route.isEditMode() && !CardVisuals.isFullscreen()) {
			CardEditor.setEditorButtonIndex(editorButtonIndex);
		} else {
			this.selectButton(index);
		}
	}

	static switchCard (updateLearningMode = 0, answeredCard = 0, answer = 0) {
		let flashcardCarousel = $('#cardCarousel');

		flashcardCarousel.on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
			CardNavigation.toggleVisibility(false);
			flashcardCarousel.off('slide.bs.carousel');
		});

		flashcardCarousel.on('slid.bs.carousel', function () {
			$('.scrollLeft').removeClass('pressed');
			$('.scrollRight').removeClass('pressed');
			CardNavigation.setActiveCardData();
			Session.set('isQuestionSide', true);
			if (updateLearningMode === 1) {
				Meteor.call('updateLeitner', Router.current().params._id, answeredCard, answer);
			} else if (updateLearningMode === 2) {
				Meteor.call("updateWozniak", Router.current().params._id, answeredCard, answer);
			}
			setTimeout(function () {
				CardNavigation.toggleVisibility(true);
				flashcardCarousel.off('slid.bs.carousel');
			}, 300);
		});
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
				cardset_id: Router.current().params._id
			};
			localStorage.setItem(lastActiveCardString, JSON.stringify(lastActiveCard));
		}
		let cardset_id;
		if (Session.get('activeCard') === -1 || Session.get('activeCard') === undefined) {
			if (Route.isDemo()) {
				Session.set('activeCardsetName', Cardsets.findOne({name: "DemoCardset", shuffled: true}).name);
			} else if (Route.isMakingOf()) {
				Session.set('activeCardsetName', Cardsets.findOne({name: "MakingOfCardset", shuffled: true}).name);
			} else {
				Session.set('activeCardsetName', Cardsets.findOne({_id: Router.current().params._id}).name);
			}
		} else {
			cardset_id = Cards.findOne({_id: Session.get('activeCard')}).cardset_id;
			Session.set('activeCardsetName', Cardsets.findOne({_id: cardset_id}).name);
		}
	}

	static restoreActiveCard () {
		if (Route.isPresentation() || Route.isCardset()) {
			if (localStorage.getItem(lastActiveCardString) !== undefined && localStorage.getItem(lastActiveCardString) !== null) {
				let lastActiveCard = JSON.parse(localStorage.getItem(lastActiveCardString));
				if (Router.current().params._id === lastActiveCard.cardset_id && Cards.findOne({_id: lastActiveCard._id})) {
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
		if (scrollRight) {
			$('.scrollRight').addClass('pressed');
			$('.carousel').carousel('next');
		} else {
			$('.scrollLeft').addClass('pressed');
			$('.carousel').carousel('prev');
		}
		this.toggleVisibility(false);
		this.switchCard();
	}

	static answerCard (updateLearningMode, answer) {
		let answeredCard = $('.carousel-inner > .active').attr('data-id');
		Session.set('isQuestionSide', false);
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
		if (updateLearningMode === 2) {
			answer = $(answer.currentTarget).data("id");
		}
		if ($('.carousel-inner > .item').length === 1) {
			if (updateLearningMode === 1) {
				Meteor.call('updateLeitner', Router.current().params._id, answeredCard, answer);
			} else if (updateLearningMode === 2) {
				Meteor.call("updateWozniak", Router.current().params._id, answeredCard, answer);
			}
		} else {
			this.toggleVisibility(false);
			this.switchCard(updateLearningMode, answeredCard, answer);
		}
	}

	static rateLeitner (answer) {
		this.answerCard(1, answer);
	}

	static fullscreenExitEvents () {
		if (screenfull.enabled) {
			screenfull.on('change', () => {
				if (screenfull.element === null && Session.get('fullscreen')) {
					if (Route.isPresentation()) {
						SweetAlertMessages.continuePresentation();
					} else if (Route.isBox() || Route.isMemo()) {
						SweetAlertMessages.activateFullscreen();
					} else {
						$(".toggleFullscreen").click();
					}
				}
			});
		}
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
			if (Route.isCardset() || Route.isBox() || Route.isMemo()) {
				keyCodes = [9];
			}
			if (Route.isEditMode()) {
				if ($('#subjectEditor').is(":focus")) {
					keyCodes = [9, 13];
				} else if ($('.learningGoalLevelButton').is(":focus")) {
					keyCodes = [9, 13, 37, 39];
				} else {
					keyCodes = [9];
				}
			}
			if (Route.isDemo()) {
				keyCodes = [9, 32, 37, 38, 39, 40];
			}
			if (Session.get('fullscreen') && CardVisuals.isEditorFullscreen() === false) {
				keyCodes = [9, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 78, 89, 90, 96, 97, 98, 99, 100, 101];
			}
			if (keyCodes.indexOf(event.keyCode) > -1) {
				switch (event.keyCode) {
					case 9:
						if (Route.isEditMode()) {
							if (Session.get('isDeepLModalVisible')) {
								$('#cardModalDeepLTranslation').modal('hide');
							} else {
								CardEditor.setEditorButtonFocus();
							}
						} else {
							if (CardType.gotDictionary(Session.get('cardType'))) {
								if (Session.get('isDeepLModalVisible')) {
									$('#cardModalDeepLTranslation').modal('hide');
								} else {
									$('#cardModalDeepLTranslation').modal('show').one('hidden.bs.modal', function () {
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
									CardNavigation.cardSideNavigation();
								} else if (!CardNavigation.isLastCard()) {
									CardNavigation.skipAnswer();
								}
							} else if ((Route.isBox() || Route.isMemo()) && Session.get('isQuestionSide')) {
								CardNavigation.skipAnswer();
							}
						}
						break;
					case 37:
						if (Route.isEditMode() && !CardVisuals.isFullscreen()) {
							CardEditor.setLearningGoalLevelIndex(false);
						} else {
							if (CardNavigation.isVisible()) {
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
						if (Route.isEditMode() && !CardVisuals.isFullscreen()) {
							CardEditor.setLearningGoalLevelIndex();
						} else {
							if (CardNavigation.isVisible()) {
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
							$('#notknown').click();
						}
						break;
					case 89:
						if (!Session.get('isQuestionSide')) {
							$('#known').click();
						} else {
							$('#learnShowAnswer').click();
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
				}
				event.preventDefault();
			}
		}
	}
};
