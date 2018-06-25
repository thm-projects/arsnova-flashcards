//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {CardVisuals} from "../../api/cardVisuals.js";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor.js";
import {CardIndex} from "../../api/cardIndex.js";
import {Route} from "../../api/route.js";
import {CardType} from "../../api/cardTypes";
import {CardNavigation} from "../../api/cardNavigation";
import "./card.html";
import '/client/hammer.js';
import './header/header.js';
import './content/content.js';
import './navigation/navigation.js';

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
		setTimeout(function () {
			CardVisuals.resizeFlashcard();
		}, 250);
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
	cardActive: function (resetData) {
		let cubeSides;
		if (Route.isEditMode()) {
			return true;
		}
		if (Session.get('activeCard')) {
			if (Session.get('activeCard') === this._id) {
				if (resetData) {
					cubeSides = CardType.getCardTypeCubeSides(this.cardType);
					Session.set('cardType', this.cardType);
					Session.set('activeCardContentId', cubeSides[0].contentId);
					Session.set('activeCardStyle', cubeSides[0].defaultStyle);
				}
				return true;
			}
		} else {
			let cardIndex = CardIndex.getCardIndex();
			if (this._id === cardIndex[0]) {
				if (resetData) {
					cubeSides = CardType.getCardTypeCubeSides(this.cardType);
					Session.set('cardType', this.cardType);
					Session.set('activeCardContentId', cubeSides[0].contentId);
					Session.set('activeCardStyle', cubeSides[0].defaultStyle);
				}
				return true;
			}
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	getCards: function () {
		let result;
		if (Route.isBox()) {
			result = CardIndex.getLeitnerCards();
		}
		if (Route.isCardset() || Route.isPresentation() || Route.isDemo()) {
			result = CardIndex.getCardsetCards();
		}
		if (Route.isMemo()) {
			result = CardIndex.getMemoCards();
		}
		if (Route.isEditMode()) {
			result = CardIndex.getEditModeCard();
		}
		if (Session.get('activeCard') === undefined) {
			Session.set('activeCard', result[0]._id);
		}
		return result;
	},
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	isDictionary: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryPreview');
		}
	},
	getCardSideColorActive: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, true);
	},
	getCardSideColorInactive: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, false);
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
	CardNavigation.fullscreenExitEvents();
	$(document).on('keydown', function (event) {
		CardNavigation.keyEvents(event);
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
		Meteor.call("deleteCard", Session.get('activeCard'));
		Bert.alert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
		if (Route.isCardset()) {
			let result = CardIndex.getCardsetCards();
			Session.set('activeCard', result[0]._id);
		}
		$('#deleteCardModal').modal('hide');
		$('#deleteCardModal').on('hidden.bs.modal', function () {
			$('.deleteCard').removeClass("pressed");
			if (Route.isEditMode()) {
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			}
		});
	}
});
