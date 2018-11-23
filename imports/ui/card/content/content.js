import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../../api/cards.js";
import {CardVisuals} from "../../../api/cardVisuals.js";
import {CardType} from "../../../api/cardTypes";
import {Route} from "../../../api/route.js";
import '/client/thirdParty/hammer.js';
import "./content.html";
import {CardNavigation} from "../../../api/cardNavigation";
import {Dictionary} from "../../../api/dictionary";
import "./item/countCards.js";
import "./item/countCardsLeitner.js";

/*
 * ############################################################################
 * cardContentCounter
 * ############################################################################
 */

Template.cardContentCounter.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isPresentation: function () {
		return Route.isPresentation();
	},
	isMakingOf: function () {
		return Route.isMakingOf();
	},
	isDemo: function () {
		return Route.isDemo();
	},
	isEditMode: function () {
		return Route.isEditMode();
	},
	isBox: function () {
		return Route.isBox();
	},
	isMemo: function () {
		return Route.isMemo();
	}
});

/*
 * ############################################################################
 * cardDictionaryContentBeolingus
 * ############################################################################
 */

Template.cardDictionaryContentBeolingus.onRendered(function () {
	Dictionary.setBlur();
});

Template.cardDictionaryContentBeolingus.helpers({
	getDictionarySearchText: function () {
		return Dictionary.getQuery(this, 1);
	}
});

/*
 * ############################################################################
 * cardDictionaryContentDeepL
 * ############################################################################
 */

Template.cardDictionaryContentDeepL.onRendered(function () {
	Dictionary.setBlur();
});


Template.cardDictionaryContentDeepL.helpers({
	getDictionaryQuery: function () {
		return Dictionary.getQuery(this, 2);
	}
});

/*
 * ############################################################################
 * cardSubject
 * ############################################################################
 */
Template.cardSubject.helpers({
	getSubject: function () {
		if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).subject;
		} else {
			if (this.subject) {
				return this.subject;
			} else {
				return CardType.getSubjectPlaceholderText(Session.get('cardType'));
			}
		}
	},
	gotLearningUnit: function () {
		if (Session.get('selectedHint')) {
			let card = Cards.findOne({_id: Session.get('selectedHint')});
			return (CardType.gotLearningUnit(card.cardType) && card.learningUnit !== "0");
		} else {
			return (CardType.gotLearningUnit(this.cardType) && this.learningUnit !== "0");
		}
	},
	getLearningIndex: function () {
		if (Route.isEditMode()) {
			return Session.get('learningIndex');
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).learningIndex;
		} else {
			return this.learningIndex;
		}
	},
	getLearningUnit: function () {
		if (Route.isEditMode()) {
			return Session.get('learningUnit');
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).learningUnit;
		} else {
			return this.learningUnit;
		}
	}
});

/*
 * ############################################################################
 * cardContentActive
 * ############################################################################
 */

Template.cardContentActive.onCreated(function () {
	CardVisuals.setTextZoom();
});

Template.cardContentActive.helpers({
	isCentered: function () {
		return CardVisuals.isCentered(Session.get('activeCardContentId'), this.centerTextElement);
	},
	isLeftAlign: function () {
		return CardVisuals.isLeftAlign(Session.get('activeCardContentId'), this.alignType);
	},
	gotContent: function () {
		Dictionary.initializeQuery(this);
		if (!Route.isCardset()) {
			return true;
		} else {
			switch (Session.get('activeCardContentId')) {
				case 1:
					return this.front !== '' && this.front !== undefined;
				case 2:
					return this.back !== '' && this.back !== undefined;
				case 3:
					return this.hint !== '' && this.hint !== undefined;
				case 4:
					return this.lecture !== '' && this.lecture !== undefined;
				case 5:
					return this.top !== '' && this.top !== undefined;
				case 6:
					return this.bottom !== '' && this.bottom !== undefined;
			}
		}
	},
	getContent: function () {
		switch (Session.get('activeCardContentId')) {
			case 1:
				return this.front;
			case 2:
				return this.back;
			case 3:
				return this.hint;
			case 4:
				return this.lecture;
			case 5:
				return this.top;
			case 6:
				return this.bottom;
		}
	},
	getPlaceholder: function () {
		return CardType.getPlaceholderText(Session.get('activeCardContentId'), this.cardType, this.learningGoalLevel);
	}
});

Template.cardContentActive.events({
	'click a': function (evt) {
		CardNavigation.linkNavigation(evt);
	}
});

/*
 * ############################################################################
 * cardContentInactive
 * ############################################################################
 */

Template.cardContentInactive.onCreated(function () {
	CardVisuals.setTextZoom();
});

Template.cardContentInactive.helpers({
	isCentered: function () {
		let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
		return CardVisuals.isCentered((CardType.getActiveSideData(cubeSides, this.cardType)), this.centerTextElement);
	},
	isLeftAlign: function () {
		let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
		return CardVisuals.isLeftAlign((CardType.getActiveSideData(cubeSides, this.cardType)), this.alignType);
	},
	gotContent: function () {
		if (!Route.isCardset()) {
			return true;
		} else {
			let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
			switch (CardType.getActiveSideData(cubeSides, this.cardType)) {
				case 1:
					return this.front !== '' && this.front !== undefined;
				case 2:
					return this.back !== '' && this.back !== undefined;
				case 3:
					return this.hint !== '' && this.hint !== undefined;
				case 4:
					return this.lecture !== '' && this.lecture !== undefined;
				case 5:
					return this.top !== '' && this.top !== undefined;
				case 6:
					return this.bottom !== '' && this.bottom !== undefined;
			}
		}
	},
	getContent: function () {
		let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
		switch (CardType.getActiveSideData(cubeSides, this.cardType)) {
			case 1:
				return this.front;
			case 2:
				return this.back;
			case 3:
				return this.hint;
			case 4:
				return this.lecture;
			case 5:
				return this.top;
			case 6:
				return this.bottom;
		}
	},
	getPlaceholder: function () {
		let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
		return CardType.getPlaceholderText((CardType.getActiveSideData(cubeSides, this.cardType)), this.cardType, this.learningGoalLevel);
	}
});
