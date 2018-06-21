import {Session} from "meteor/session";
import {Route} from "./route";
import {Cards} from "./cards";
import {CardVisuals} from "./cardVisuals";
import {CardEditor} from "./cardEditor";
import {MarkdeepEditor} from "./markdeepEditor";

export let CardNavigation = class CardNavigation {

	static isAnswer (isAnswer, contentId) {
		let result = (Route.isBox() || Route.isMemo()) && isAnswer;
		if (result) {
			Session.set('questionSide', contentId);
		}
		return result;
	}

	static selectButton (index = 1) {
		$(".cardNavigation > li:nth-child(" + index + ") a").click();
	}

	static switchCardSide (contentId, navigationId, cardStyle) {
		CardVisuals.isTextCentered();
		Session.set('dictionaryPreview', 0);
		Session.set('activeCardStyle', cardStyle);
		Session.set('activeCardContentId', contentId);
		CardEditor.setEditorContent(navigationId);
		this.setActiveNavigationButton(navigationId);
	}

	static updateNavigation () {
		Session.set('activeCard', $('.carousel-inner > .active').attr('data-id'));
		Session.set('cardType', Cards.findOne({_id: Session.get('activeCard')}).cardType);
	}

	static setActiveNavigationButton (index) {
		$('.cardNavigation a').removeClass('btn-primary').addClass('btn-default');
		$(".cardNavigation > li:nth-child(" + index + ") a").removeClass('btn-default').addClass('btn-primary');
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
		let index = ($(".btn-primary").index(".cardNavigation a"));
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

	static switchCard () {
		if (!Session.get('navigationDisabled')) {
			let flashcardCarousel = $('#cardCarousel');
			flashcardCarousel.on('slide.bs.carousel', function () {
				CardVisuals.resizeFlashcard();
				CardNavigation.toggleVisibility(false);
			});
			flashcardCarousel.on('slid.bs.carousel', function () {
				Session.set('activeCard', $(".item.active").data('id'));
				CardNavigation.updateNavigation();
				setTimeout(function () {
					CardNavigation.toggleVisibility(true);
				}, 300);
			});
		}
	}

	static isVisible () {
		return Session.get('navigationVisible');
	}

	static toggleVisibility (status) {
		Session.set('navigationVisible', status);
	}

	static skipAnswer (scrollRight = true) {
		if (scrollRight) {
			$('.carousel').carousel('next');
		} else {
			$('.carousel').carousel('prev');
		}
		$('html, body').animate({scrollTop: '0px'}, 300);
		$('#cardCarousel').on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
		});
		$('#cardCarousel').on('slid.bs.carousel', function () {
			Session.set('animationPlaying', false);
			Session.set('activeCard', $(".item.active").data('id'));
		});
		CardEditor.editFront();
		Session.set('isQuestionSide', true);
	}

	static rateLeitner (answer) {
		let answeredCard = $('.carousel-inner > .active').attr('data-id');
		Session.set('isQuestionSide', true);
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
		if ($('.carousel-inner > .item').length === 1) {
			Meteor.call('updateLeitner', Router.current().params._id, answeredCard, answer);
		} else {
			$('#cardCarousel').on('slide.bs.carousel', function () {
				CardVisuals.resizeFlashcard();
			});
			$('#cardCarousel').on('slid.bs.carousel', function () {
				Meteor.call('updateLeitner', Router.current().params._id, answeredCard, answer);
				Session.set('animationPlaying', false);
				Session.set('activeCard', $(".item.active").data('id'));
			});
		}
	}

	static rateWozniak (event) {
		let answeredCard = $('.carousel-inner > .active').attr('data-id');
		Session.set('isQuestionSide', true);
		$('.carousel').carousel('next');
		$('html, body').animate({scrollTop: '0px'}, 300);
		if ($('.carousel-inner > .item').length === 1) {
			Meteor.call("updateWozniak", Router.current().params._id, answeredCard, $(event.currentTarget).data("id"));
		} else {
			$('#cardCarousel').on('slide.bs.carousel', function () {
				CardVisuals.resizeFlashcard();
			});
			$('#cardCarousel').on('slid.bs.carousel', function () {
				Meteor.call("updateWozniak", Router.current().params._id, answeredCard, $(event.currentTarget).data("id"));
				Session.set('animationPlaying', false);
				Session.set('activeCard', $(".item.active").data('id'));
			});
		}
	}


	static keyEvents (event) {
		if (event.keyCode === 27) {
			if (Route.isPresentation()) {
				if (!$("#endPresentationModal").is(':visible')) {
					$('#endPresentationModal').modal('show');
				}
			} else {
				CardVisuals.toggleFullscreen(true);
			}
		}
		if (Session.get('fullscreen') && CardVisuals.isEditorFullscreen() === false) {
			if ([9, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 78, 89, 90, 96, 97, 98, 99, 100, 101].indexOf(event.keyCode) > -1) {
				switch (event.keyCode) {
					case 9:
						if (Route.isPresentation()) {
							MarkdeepEditor.cardSideNavigation();
						}
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
					case 27:
						if (Route.isPresentation()) {
							$(".endPresentation").click();
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
						MarkdeepEditor.cardSideNavigation();
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
						MarkdeepEditor.cardSideNavigation(false);
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
