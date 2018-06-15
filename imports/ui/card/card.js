//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import "./card.html";
import '/client/hammer.js';
import './header/header.js';
import './content/content.js';
import {skipAnswer} from "../learn/learn.js";
import {CardVisuals} from "../../api/cardVisuals.js";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor.js";
import {MarkdeepEditor} from "../../api/markdeepEditor.js";
import {CardIndex} from "../../api/cardIndex.js";
import {Route} from "../../api/route.js";
import {CardEditor} from "../../api/cardEditor.js";

/*
 * ############################################################################
 * flashcards
 * ############################################################################
 */


Template.flashcards.onCreated(function () {
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
	Session.set('reverseViewOrder', false);
	Session.set('selectedHint', undefined);
	Session.set('isQuestionSide', true);
});

let resizeInterval;
Template.flashcards.onRendered(function () {
	if (!Route.isEditMode()) {
		Session.set('activeEditMode', 0);
	}
	if (window.innerWidth <= 1400) {
		if (Router.current().route.getName() === "cardsetdetailsid") {
			let mc = new Hammer.Manager(document.getElementById('set-details-region'));
			mc.add(new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 50}));
			mc.on("swipe", function (ev) {
				if (ev.deltaX < 0) {
					document.getElementById('rightCarouselControl').click();
				} else {
					document.getElementById('leftCarouselControl').click();
				}
			});
		}
	}
	$(".box").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
		$(".box").removeClass("disableCardTransition");
	});
	if (Session.get("workloadFullscreenMode")) {
		CardVisuals.toggleFullscreen();
	}
	$('#showHintModal').on('hidden.bs.modal', function () {
		$('#showHint').children().removeClass("pressed");
		Session.set('selectedHint', undefined);
	});
	$('#showCopyCardModal').on('hidden.bs.modal', function () {
		$('#copyCard').children().removeClass("pressed");
	});
	new ResizeSensor($('#cardCarousel'), function () {
		CardVisuals.resizeFlashcard();
	});
	CardVisuals.resizeFlashcard();
});

Template.flashcards.onDestroyed(function () {
	if (resizeInterval !== undefined) {
		clearInterval(resizeInterval);
		resizeInterval = undefined;
	}
});

Template.flashcards.helpers({
	cardActive: function () {
		if (Route.isNewCard()) {
			return true;
		}
		if (Session.get('activeCard')) {
			return Session.get('activeCard') === this._id;
		} else {
			let cardIndex = CardIndex.getCardIndex();
			if (this._id === cardIndex[0]) {
				return true;
			}
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	getCards: function () {
		if (Route.isBox()) {
			return CardIndex.getLeitnerCards();
		}
		if (Route.isCardset() || Route.isPresentation() || Route.isDemo()) {
			return CardIndex.getCardsetCards();
		}
		if (Route.isMemo()) {
			return CardIndex.getMemoCards();
		}
		if (Route.isEditMode()) {
			return CardIndex.getEditModeCard();
		}
	}
});

/*
 * ############################################################################
 * flashcardNavigation
 * ############################################################################
 */
Template.flashcardNavigation.helpers({
	isCardsetOrPresentation: function () {
		return Route.isCardset() || Route.isPresentationOrDemo();
	},
	cardCountOne: function () {
		var cardset = Session.get('activeCardset');
		var count = Cards.find({
			cardset_id: cardset._id
		}).count();
		return count === 1;
	}
});

Template.flashcardNavigation.events({
	"click #leftCarouselControl, click #rightCarouselControl": function () {
		let showLecture = $('.item.active .showLecture.pressed');
		if (Session.get('reverseViewOrder')) {
			if (Route.isPresentationOrDemo()) {
				CardEditor.editBack();
			} else {
				showLecture.click();
				CardVisuals.turnBack();
			}
		} else {
			if (Route.isPresentationOrDemo()) {
				CardEditor.editFront();
			} else {
				showLecture.click();
				CardVisuals.turnFront();
			}
		}
		let flashcardCarousel = $('#cardCarousel');
		flashcardCarousel.on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
		});
		flashcardCarousel.on('slid.bs.carousel', function () {
			Session.set('activeCard', $(".item.active").data('id'));
			if (Route.isPresentationOrDemo()) {
				CardEditor.updateNavigation();
			}
		});
	}
});

/*
 * ############################################################################
 * flashcardsEmpty
 * ############################################################################
 */

Template.flashcardsEmpty.onCreated(function () {
	if (Session.get('fullscreen')) {
		CardVisuals.toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

Template.flashcardsEmpty.helpers({
	isBox: function () {
		return Route.isBox();
	},
	isCardset: function () {
		return Route.isCardset();
	}
});

Template.flashcardsEmpty.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
});

/*
 * ############################################################################
 * flashcardsEnd
 * ############################################################################
 */

Template.flashcardsEnd.onCreated(function () {
	if (Session.get('fullscreen')) {
		CardVisuals.toggleFullscreen();
	}
});

Template.flashcardsEnd.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
});

/*
 * ############################################################################
 * copyCard
 * ############################################################################
 */

Template.copyCard.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId(),
			shuffled: false,
			_id: {$nin: [Router.current().params._id]}
		}, {
			fields: {name: 1},
			sort: {name: 1}
		});
	}
});

Template.copyCard.events({
	"click .copyCardset": function (evt) {
		Meteor.call("copyCard", Router.current().params._id, $(evt.target).data('id'), Session.get('activeCard'), function (error, result) {
			if (result) {
				$('#showCopyCardModal').modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				Bert.alert(TAPi18n.__('copycardSuccess'), "success", 'growl-top-left');
			}
		});
	}
});

Meteor.startup(function () {
	$(document).on('keydown', function (event) {
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
						if ($('#rightCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer();
						}
						break;
					case 27:
						if (Route.isPresentation()) {
							$(".endPresentation").click();
						}
						break;
					case 37:
						if ($('#leftCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer(false);
						}
						break;
					case 38:
						if (Route.isPresentationOrDemo()) {
							MarkdeepEditor.cardSideNavigation();
						} else {
							CardVisuals.turnFront();
						}
						break;
					case 39:
						if ($('#rightCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer();
						}
						break;
					case 40:
						if (Route.isPresentationOrDemo()) {
							MarkdeepEditor.cardSideNavigation(false);
						} else {
							CardVisuals.turnBack();
						}
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
	});
});

/*
 * ############################################################################
 * cancelEditForm
 * ############################################################################
 */

Template.cancelEditForm.events({
	'click #cancelEditConfirm': function () {
		$('#cancelEditModal').on('hidden.bs.modal', function () {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * deleteCardForm
 * ############################################################################
 */

Template.deleteCardForm.events({
	'click #deleteCardConfirm': function () {
		$('#deleteCardModal').on('hidden.bs.modal', function () {
			Session.set('activeCard', undefined);
			Meteor.call("deleteCard", Router.current().params.card_id);
			Bert.alert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});
