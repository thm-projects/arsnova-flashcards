//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {CardVisuals} from "../../api/cardVisuals.js";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor.js";
import {CardIndex} from "../../api/cardIndex.js";
import {Route} from "../../api/route.js";
import {CardType} from "../../api/cardTypes";
import {CardNavigation} from "../../api/cardNavigation";
import {Leitner, Wozniak} from "../../api/learned.js";
import "./card.html";
import '/client/thirdParty/hammer.js';
import './header/header.js';
import './content/content.js';
import './navigation/navigation.js';
import './modal/settings.js';
import {BertAlertVisuals} from "../../api/bertAlertVisuals";
import {CardEditor} from "../../api/cardEditor";

/*
 * ############################################################################
 * flashcards
 * ############################################################################
 */


Template.flashcards.onCreated(function () {
	if (Route.isDemo()) {
		Session.set('activeCardset', Cardsets.findOne({kind: 'demo', name: 'DemoCardset', shuffled: true}));
	} else if (Route.isMakingOf()) {
		Session.set('activeCardset', Cardsets.findOne({kind: 'demo', name: 'MakingOfCardset', shuffled: true}));
	} else {
		Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
	}
	Session.set('selectedHint', undefined);
	Session.set('isQuestionSide', true);
	if (Session.get('activeCard') === undefined) {
		CardNavigation.restoreActiveCard();
	}
});

let resizeInterval;
let windowResizeSensor;
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
		CardVisuals.resizeFlashcard();
	});
	windowResizeSensor = $(window).resize(function () {
		CardVisuals.resizeFlashcard();
	});
	CardVisuals.resizeFlashcard();
	CardVisuals.setTextZoom();
	if (Route.isEditMode()) {
		CardEditor.setEditorButtonIndex(0);
	}
});

Template.flashcards.onDestroyed(function () {
	if (resizeInterval !== undefined) {
		clearInterval(resizeInterval);
		resizeInterval = undefined;
	}
	if (windowResizeSensor !== undefined) {
		windowResizeSensor.off('resize');
	}
});

Template.flashcards.helpers({
	isActiveCard: function (resetData) {
		if (Route.isEditMode()) {
			return true;
		} else {
			if (Session.get('activeCard') === this._id) {
				if (resetData) {
					let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
					Session.set('cardType', this.cardType);
					Session.set('activeCardContentId', CardType.getActiveSideData(cubeSides, this.cardType));
					Session.set('activeCardStyle', CardType.getActiveSideData(cubeSides, this.cardType, 1));
				}
				return true;
			}
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	getCards: function () {
		return CardIndex.getCards();
	},
	cardsIndex: function (card_id) {
		return CardIndex.getActiveCardIndex(card_id);
	},
	isBeolingusDictionary: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryMode') === 1 && !Route.isEditMode();
		}
	},
	isDeepLDictionary: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryMode') === 2 && !Route.isEditMode();
		}
	},
	getCardSideColorActive: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, true);
	},
	getCardSideColorInactive: function () {
		return CardVisuals.getCardSideColor(this.difficulty, this.cardType, this.backgroundStyle, false);
	},
	isMobilePreviewActive: function () {
		return Session.get('mobilePreview') && Route.isEditMode();
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
});

Template.flashcardsEmpty.helpers({
	isBox: function () {
		return Route.isBox();
	},
	isCardset: function () {
		return Route.isCardset();
	},
	gotLeitnerWorkload: function () {
		return Leitner.find({cardset_id: Router.current().params._id, user_id: Meteor.user()}).count();
	},
	gotWozniakWorkload: function () {
		return Wozniak.find({cardset_id: Router.current().params._id, user_id: Meteor.user()}).count();
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
				BertAlertVisuals.displayBertAlert(TAPi18n.__('copycardSuccess'), "success", 'growl-top-left');
			}
		});
	}
});

/*
 * ############################################################################
 * cancelEditForm
 * ############################################################################
 */

Template.cancelEditForm.events({
	'click #cancelEditConfirm': function () {
		$('#cancelEditModal').on('hidden.bs.modal', function () {
			Session.set('activeCard', Router.current().params.card_id);
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
		Meteor.call("deleteCard", Session.get('activeCard'), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
				$('#deleteCardModal').modal('hide');
				$('.modal-backdrop').css('display', 'none');
				Session.set('activeCard', undefined);
				$('#deleteCardModal').on('hidden.bs.modal', function () {
					$('.deleteCard').removeClass("pressed");
					if (Route.isEditMode()) {
						Router.go('cardsetdetailsid', {
							_id: Router.current().params._id
						});
					} else {
						CardVisuals.resizeFlashcard();
						CardNavigation.selectButton();
					}
				});
			}
		});
	}
});
