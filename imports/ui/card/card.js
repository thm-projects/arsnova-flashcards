//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/subscriptions/cardsets.js";
import {CardVisuals} from "../../api/cardVisuals.js";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor.js";
import {CardIndex} from "../../api/cardIndex.js";
import {Route} from "../../api/route.js";
import {CardType} from "../../api/cardTypes";
import {Cards} from "../../api/subscriptions/cards";
import {CardNavigation} from "../../api/cardNavigation";
import {Leitner} from "../../api/subscriptions/leitner";
import {Wozniak} from "../../api/subscriptions/wozniak";
import {BertAlertVisuals} from "../../api/bertAlertVisuals";
import {CardEditor} from "../../api/cardEditor";
import {TouchNavigation} from "../../api/touchNavigation";
import './side/header/header.js';
import './side/content/content.js';
import './navigation/navigation.js';
import "./modal/transcriptRating/accept.js";
import "./modal/transcriptRating/deny.js";
import './modal/settings.js';
import "./modal/beolingusTranslation.js";
import "./modal/deeplTranslation.js";
import "./modal/deleteCard.js";
import "./modal/copyCard.js";
import './side/side.js';
import './cube/cube.js';
import "./card.html";

function isActiveCard(card, resetData) {
	if (Route.isEditMode()) {
		return true;
	} else {
		if (Session.get('activeCard') === card._id) {
			if (resetData) {
				let cubeSides = CardType.getCardTypeCubeSides(card.cardType);
				Session.set('cardType', card.cardType);
				Session.set('activeCardContentId', CardType.getActiveSideData(cubeSides, card.cardType));
				Session.set('activeCardStyle', CardType.getActiveSideData(cubeSides, card.cardType, 1));
			}
			return true;
		}
	}
}

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


Template.flashcards.onRendered(function () {
	TouchNavigation.cards();
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
	if (Route.isEditMode()) {
		CardEditor.setEditorButtonIndex(0);
	}
	CardVisuals.setDefaultViewingMode();
});

Template.flashcards.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isMobilePreviewActive: function () {
		return Session.get('mobilePreview') && Route.isEditMode();
	}
});

/*
 * ############################################################################
 * flashcardsCarouselContent
 * ############################################################################
 */

Template.flashcardsCarouselContent.onRendered(function () {
	CardVisuals.resizeFlashcard();
	CardVisuals.setTextZoom();
});

Template.flashcardsCarouselContent.helpers({
	getCards: function () {
		return CardIndex.getCards();
	},
	setCardStatus: function () {
		this.isActive = isActiveCard(this, true);
		return this;
	}
});

/*
 * ############################################################################
 * flashcardsCarouselContent3D
 * ############################################################################
 */

Template.flashcardsCarouselContent3D.onRendered(function () {
	CardVisuals.resizeFlashcard();
	CardVisuals.setTextZoom();
});

Template.flashcardsCarouselContent3D.helpers({
	getCards: function () {
		return CardIndex.getCards();
	},
	setCardStatus: function () {
		this.isActive = isActiveCard(this, true);
		return this;
	},
	isActiveCard: function () {
		return isActiveCard(this, false);
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
 * cardSubject
 * ############################################################################
 */
Template.cardSubject.helpers({
	getSubject: function () {
		if (CardType.gotLearningUnit(this.cardType)) {
			if (Session.get('transcriptBonus') !== undefined) {
				return Cardsets.findOne({_id: Session.get('transcriptBonus').cardset_id}).name;
			}
		}
		if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).subject;
		} else {
			if (this.subject) {
				return this.subject;
			} else {
				return CardType.getSubjectPlaceholderLabel(Session.get('cardType'));
			}
		}
	},
	gotBonusTranscript: function () {
		return Session.get('transcriptBonus');
	},
	getBonusLecture: function () {
		return Session.get('transcriptBonus').cardset_id;
	}
});

/*
 * ############################################################################
 * flashcardsReviewEnd
 * ############################################################################
 */

Template.flashcardsReviewEnd.events({
	"click #backToSubmissions": function () {
		Router.go('transcriptBonus', {_id: Router.current().params._id});
	}
});
