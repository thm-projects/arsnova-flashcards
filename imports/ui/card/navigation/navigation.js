import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import {Route} from "../../../api/route";
import {CardType} from "../../../api/cardTypes";
import {CardNavigation} from "../../../api/cardNavigation";
import "./item/review.js";
import "./navigation.html";
import {Cards} from "../../../api/subscriptions/cards";
import {CardIndex} from "../../../api/cardIndex";
import {MainNavigation} from "../../../api/mainNavigation";
import {NavigatorCheck} from "../../../api/navigatorCheck";
import {FirstTimeVisit} from "../../../api/firstTimeVisit";
Session.setDefault('activeCardSide', undefined);
Session.setDefault('leitnerHistoryTimestamps', {question: new Date(), answer: new Date()});

/*
 * ############################################################################
 * cardNavigation
 * ############################################################################
 */

Template.cardNavigation.helpers({
	isNavigationVisible: function () {
		return CardNavigation.isVisible();
	},
	isLearningMode: function () {
		return (Route.isMemo() || Route.isBox());
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	}
});

Template.cardNavigation.onCreated(function () {
	if (Session.get('fullscreen') && !Route.isPresentationOrDemo()) {
		CardVisuals.toggleFullscreen();
	}
	CardNavigation.setActiveCardData(undefined, true);
	CardNavigation.toggleVisibility(true);
});

Template.cardNavigation.onRendered(function () {
	if (localStorage.getItem(MainNavigation.getFirstTimePresentationString()) !== "true" && Route.isPresentationOrDemo() && !NavigatorCheck.isSmartphone() && FirstTimeVisit.isFirstTimePresentationModalEnabled()) {
		$('#helpModal').modal('show');
		localStorage.setItem(MainNavigation.getFirstTimePresentationString(), true);
	}
});

/*
 * ############################################################################
 * cardNavigationEnabled
 * ############################################################################
 */

Template.cardNavigationEnabled.events({
	'click .switchCardSide': function (event) {
		Session.set('activeCardSide', $(event.target).data('navigation-id') + 1);
		CardNavigation.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'), $(event.target).data('side'));
	}
});

Template.cardNavigationEnabled.helpers({
	getCardTypeSides: function () {
		return CardNavigation.indexNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')));
	}
});

Template.cardNavigationEnabled.onRendered(function () {
	if ((Route.isEditMode() || Route.isDefaultPresentation())  && Session.get('activeCardSide') !== undefined) {
		CardNavigation.selectButton(Session.get('activeCardSide'));
	} else {
		CardNavigation.selectActiveButton();
	}
	CardVisuals.setSidebarPosition();
});

/*
 * ############################################################################
 * cardNavigationEnabledAnswer
 * ############################################################################
 */

Template.cardNavigationEnabledAnswer.events({
	'click .switchCardSide': function (event) {
		CardNavigation.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'), $(event.target).data('side'));
	}
});

Template.cardNavigationEnabledAnswer.helpers({
	getCardTypeSides: function () {
		return CardNavigation.indexNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')));
	}
});

Template.cardNavigationEnabledAnswer.onRendered(function () {
	let timestamps = Session.get('leitnerHistoryTimestamps');
	timestamps.answer = new Date();
	Session.set('leitnerHistoryTimestamps', timestamps);
	if (Session.get('swapAnswerQuestion') && CardType.isCardTypesWithSwapAnswerQuestionButton(Session.get('cardType'))) {
		CardNavigation.selectButton();
	} else {
		CardNavigation.selectButton(Session.get('answerFocus'));
	}
});

/*
 * ############################################################################
 * cardNavigationEnabledQuestion
 * ############################################################################
 */

Template.cardNavigationEnabledQuestion.events({
	'click .switchCardSide': function (event) {
		CardNavigation.switchCardSide($(event.target).data('content-id'), ($(event.target).data('navigation-id') + 1), $(event.target).data('style'), $(event.target).data('side'));
	}
});

Template.cardNavigationEnabledQuestion.helpers({
	getCardTypeSides: function () {
		if (Session.get('swapAnswerQuestion') && CardType.isCardTypesWithSwapAnswerQuestionButton(Session.get('cardType'))) {
			return CardNavigation.filterNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')), true);
		} else {
			return CardNavigation.filterNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')));
		}
	}
});

Template.cardNavigationEnabledQuestion.onRendered(function () {
	let timestamps = Session.get('leitnerHistoryTimestamps');
	timestamps.question = new Date();
	Session.set('leitnerHistoryTimestamps', timestamps);
	CardNavigation.selectButton();
});

/*
 * ############################################################################
 * cardNavigationItem
 * ############################################################################
 */

Template.cardNavigationItem.helpers({
	getTitle: function () {
		if (CardType.gotCardsetTitleNavigation(Session.get('cardType'))) {
			return Session.get('activeCardsetName');
		} else {
			return TAPi18n.__('card.cardType' + Session.get('cardType') + '.content' + this.contentId);
		}
	},
	getTabIndex: function (index) {
		return CardNavigation.getTabIndex(++index);
	},
	isFirstButton: function (index) {
		return index === 0;
	},
	isDisabled: function (contentId, dataType) {
		let card;
		if (Route.isEditMode()) {
			card = CardIndex.getEditModeCard()[0];
		} else {
			card = Cards.findOne({_id: Session.get('activeCard')}, {
				fields: {
					front: 1,
					back: 1,
					hint: 1,
					lecture: 1,
					bottom: 1,
					top: 1
				}
			});
		}
		if (card !== undefined) {
			let string = "";
			switch (contentId) {
				case 1:
					if (card.front !== undefined) {
						string = card.front.trim();
					}
					break;
				case 2:
					if (card.back !== undefined) {
						string = card.back.trim();
					}
					break;
				case 3:
					if (card.hint !== undefined) {
						string = card.hint.trim();
					}
					break;
				case 4:
					if (card.lecture !== undefined) {
						string = card.lecture.trim();
					}
					break;
				case 5:
					if (card.top !== undefined) {
						string = card.top.trim();
					}
					break;
				case 6:
					if (card.bottom !== undefined) {
						string = card.bottom.trim();
					}
					break;
			}
			if (string.length === 0) {
				if (dataType) {
					return 1;
				} else {
					return "switchCardSideEmptyContent";
				}
			}
			if (dataType) {
				return 0;
			}
		}
	}
});


/*
 * ############################################################################
 * cardArrowNavigation
 * ############################################################################
 */
Template.cardArrowNavigation.helpers({
	isCardsetOrPresentation: function () {
		return Route.isCardset() || Route.isPresentationOrDemo() || Route.isMakingOf();
	},
	cardCountOne: function () {
		var cardset = Session.get('activeCardset');
		var count = Cards.find({
			cardset_id: cardset._id
		}).count();
		return count === 1;
	},
	isNavigationVisible: function () {
		return CardNavigation.isVisible();
	}
});

Template.cardArrowNavigation.events({
	"click #leftCarouselControl, click #rightCarouselControl": function () {
		CardVisuals.toggleZoomContainer(true);
		CardVisuals.toggleAspectRatioContainer(true);
		CardNavigation.switchCard();
	}
});

/*
 * ############################################################################
 * cardNavigationDisabled
 * ############################################################################
 */

Template.cardNavigationDisabled.onCreated(function () {
	CardNavigation.checkIfReset();
});
