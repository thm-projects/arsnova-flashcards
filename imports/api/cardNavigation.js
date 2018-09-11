import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Route} from "./route";
import {CardVisuals} from "./cardVisuals";
import {CardEditor} from "./cardEditor";
import * as screenfull from "screenfull";
import {CardIndex} from "./cardIndex";
import {Cards} from "./cards";
import {Cardsets} from "./cardsets";

export let CardNavigation = class CardNavigation {

	static selectButton (index = 1) {
		$(".cardNavigation > li:nth-child(" + index + ") a").click();
	}

	static switchCardSide (contentId, navigationId, cardStyle) {
		CardVisuals.toggleZoomContainer(true);
		CardVisuals.isTextCentered();
		Session.set('dictionaryBeolingus', 0);
		Session.set('dictionaryLinguee', 0);
		Session.set('dictionaryGoogle', 0);
		Session.set('activeCardStyle', cardStyle);
		Session.set('activeCardContentId', contentId);
		CardEditor.setEditorContent(navigationId);
		this.setActiveNavigationButton(navigationId);
	}

	static setActiveNavigationButton (index) {
		$('.cardNavigation a').removeClass('btn-primary').removeClass('card-navigation-active').addClass('btn-default');
		$(".cardNavigation > li:nth-child(" + index + ") a").removeClass('btn-default').addClass('btn-primary').addClass('card-navigation-active');
	}

	static filterNavigation (cubeSides, mode) {
		if (cubeSides === undefined) {
			return [""];
		}
		if (mode === false) {
			mode = undefined;
		}
		let filteredSides = [];
		let index = 0;
		for (let i = 0; i < cubeSides.length; i++) {
			if (cubeSides[i].isAnswer === mode) {
				cubeSides[i].index = index++;
				filteredSides.push(cubeSides[i]);
			}
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

	static cardSideNavigation (forward = true) {
		let navigationLength = $(".cardNavigation a").length;
		let index = ($(".card-navigation-active").index(".cardNavigation a"));
		++index;
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
		this.selectButton(index);
	}

	static switchCard (updateLearningMode = 0, answeredCard = 0, answer = 0) {
		let flashcardCarousel = $('#cardCarousel');
		flashcardCarousel.on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
			CardNavigation.toggleVisibility(false);
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
			}, 300);
		});
	}

	static setActiveCardData (_id = undefined) {
		if (_id !== undefined) {
			Session.set('activeCard', _id);
		} else {
			Session.set('activeCard', $(".item.active").data('id'));
		}
		let cardset_id;
		if (Session.get('activeCard') === -1) {
			Session.set('activeCardsetName', Cardsets.findOne({_id: Router.current().params._id}).name);
		} else {
			cardset_id = Cards.findOne({_id: Session.get('activeCard')}).cardset_id;
			Session.set('activeCardsetName', Cardsets.findOne({_id: cardset_id}).name);
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

	static linkNavigation (evt) {
		let target = evt.target.getAttribute('href');
		if (/^#/.test(target) === true) {
			location.hash = target;
		}
	}

	static fullscreenExitEvents () {
		if (screenfull.enabled) {
			screenfull.on('change', () => {
				if (screenfull.element === null && Session.get('fullscreen')) {
					if (Route.isPresentation()) {
						$(".endPresentation").click();
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

	static keyEvents (event) {
		let keyCodes = [];

		CardVisuals.toggleZoomContainer(true);
		if (!$('#input-search').is(":focus") && !$('#lightbox').is(":visible")) {
			if (Route.isCardset() || Route.isBox() || Route.isMemo() || Route.isEditMode()) {
				keyCodes = [9];
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
						CardNavigation.cardSideNavigation();
						break;
					case 32:
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
						break;
					case 37:
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
						break;
					case 38:
						CardNavigation.scrollCardContent(false);
						break;
					case 39:
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
