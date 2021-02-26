//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/subscriptions/cardsets.js";
import {CardVisuals} from "../../util/cardVisuals.js";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor.js";
import {CardIndex} from "../../util/cardIndex.js";
import {Route} from "../../util/route.js";
import {CardType} from "../../util/cardTypes";
import {Cards} from "../../api/subscriptions/cards";
import {CardNavigation} from "../../util/cardNavigation";
import {Leitner} from "../../api/subscriptions/leitner";
import {Wozniak} from "../../api/subscriptions/wozniak";
import {BertAlertVisuals} from "../../util/bertAlertVisuals";
import {CardEditor} from "../../util/cardEditor";
import {TouchNavigation} from "../../util/touchNavigation";
import "../filter/modal/aboutThisRating.js";
import "../filter/index/item/bottom/item/aboutThisRating.js";
import "../filter/index/item/bottom/item/transcriptRating.js";
import "../filter/index/item/bottom/item/starsRating.js";
import "../main/modal/arsnovaClick.js";
import "../main/modal/arsnovaLite.js";
import "../help/help.js";
import "../main/overlays/aspectRatio.js";
import "../main/overlays/zoomText.js";
import "../presentation/presentation.js";
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
import './sidebar/sidebar.js';
import "./card.html";
import {MarkdeepEditor} from "../../util/markdeepEditor";
import {AnswerUtilities} from "../../util/answers";
import {ExecuteControllers} from 'wtc-controller-element';
import {BarfyStars, Particle, ACTIONS} from 'wtc-barfystars';
import {BarfyStarsConfig} from "../../util/barfyStars";
import * as config from "../../config/learningStatus";

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
		Session.set('activeCardset', Cardsets.findOne({"_id": FlowRouter.getParam('_id')}));
	}
	Session.set('selectedHint', undefined);
	Session.set('isQuestionSide', true);
	if (Session.get('activeCard') === undefined) {
		CardNavigation.restoreActiveCard();
	}
});

let backgroundClickEvent;
Template.flashcards.onRendered(function () {
	TouchNavigation.cards();
	$(".box").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
		$(".box").removeClass("disableCardTransition");
	});
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
	setTimeout(function () {
		backgroundClickEvent = $(".presentation-container").click(function (event) {
			CardNavigation.exitPresentationFullscreen(event);
		});
	}, 1000);
	if (Route.isBox()) {
		AnswerUtilities.focusOnAnswerIfSubmitted();
	}
});

Template.flashcards.onDestroyed(function () {
	if (backgroundClickEvent !== undefined) {
		backgroundClickEvent.off('click');
	}
	CardVisuals.setExitPresentationContainerSize(0);
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
	if (Route.isEditMode() && CardType.gotNoSideContent(Session.get('cardType')) && CardType.gotAnswerOptions(Session.get('cardType'))) {
		Session.set('isAnswerEditorEnabled', true);
		MarkdeepEditor.focusOnAnswerSide();
	}
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
	if (Route.isEditMode() && CardType.gotNoSideContent(Session.get('cardType')) && CardType.gotAnswerOptions(Session.get('cardType'))) {
		Session.set('isAnswerEditorEnabled', true);
		MarkdeepEditor.focusOnAnswerSide();
	}
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

Template.flashcardsEmpty.helpers({
	isBox: function () {
		return Route.isBox();
	},
	isCardset: function () {
		return Route.isCardset();
	},
	gotLeitnerWorkload: function () {
		return Leitner.find({cardset_id: FlowRouter.getParam('_id'), user_id: Meteor.user()}).count();
	},
	gotWozniakWorkload: function () {
		return Wozniak.find({cardset_id: FlowRouter.getParam('_id'), user_id: Meteor.user()}).count();
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

Template.flashcardsEnd.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
	config.flashCardsEndFanfare.play();
	//Check that all modules are imported and loaded
	if (BarfyStars && ACTIONS && Particle) {
		//Set mode to callback, do not allow hover mode
		const obj = BarfyStarsConfig.getConfig("images");
		obj.action = 'callback';
		//Add the confetti at the end of #main
		const main = $('#main');
		main.append('<div style="text-align: center"><a href="#" data-config=\'' +
			JSON.stringify(obj) +
			'\' class="confettiEmitter ' +
			BarfyStarsConfig.getStyle("images") +
			'"></a></div>');
		//Change overflow property (confetti forces scrollbar => hide them instead)
		main.css('overflow', 'hidden').css('height', '100%');
		$(document.body).css('height', '100%');
		//Initialize confetti controller
		const initElem = $('#main > div > a.confettiEmitter');
		initElem.each((index) => {
			const dom = initElem[index];
			//Do not instanciate if already instanciated
			if (!(dom.data && dom.data.controller)) {
				ExecuteControllers.instanciate(dom, 'BarfyStars');
			}
		});
		//Do confetti animation
		const elements = $('#main > div > div > a.confettiEmitter');
		let animationTimes = 2;
		let timer = 0;
		const playAnimation = function () {
			if (--animationTimes < 1) {
				clearInterval(timer);
			}
			if (elements.length > 0) {
				elements[0].data.controller.addParticles();
			}
		};
		playAnimation();
		if (animationTimes > 0) {
			this.timer = timer = setInterval(playAnimation, 2500);
		}
	}
});

Template.flashcardsEnd.onDestroyed(function () {
	//Stop confetti animation if running
	clearInterval(this.timer);
	//Remove confetti containers
	$('#main > div > div > a.confettiEmitter').parent().parent().remove();
	//Reset state of #main
	$('#main').css('overflow', '').css('height', '');
	$(document.body).css('height', '');
});


Template.copyCard.events({
	"click .copyCardset": function (evt) {
		Meteor.call("copyCard", FlowRouter.getParam('_id'), $(evt.target).data('id'), Session.get('activeCard'), function (error, result) {
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
		FlowRouter.go('transcriptBonus', {_id: FlowRouter.getParam('_id')});
	}
});
