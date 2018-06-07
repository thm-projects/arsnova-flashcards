import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards.js";
import "./content.html";
import '/client/hammer.js';
import {CardVisuals} from "../../api/cardVisuals.js";
import {CardType} from "../../api/cardTypes";
import {Route} from "../../api/route.js";
import {CardEditor} from "../../api/cardEditor";
import {CardIndex} from "../../api/cardIndex";

/*
 * ############################################################################
 * cardHint
 * ############################################################################
 */

Template.cardHint.helpers({
	gotAlternativeHintStyle: function (cardType) {
		return CardType.gotAlternativeHintStyle(cardType);
	},
	getHintTitle: function () {
		return CardType.getHintTitle();
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && Route.isEditModeOrPresentation());
	}
});

/*
 * ############################################################################
 * cardDictionaryContent
 * ############################################################################
 */

Template.cardDictionaryContent.helpers({
	getDictionarySearchText: function () {
		let searchText;
		if (Session.get('isQuestionSide')) {
			searchText = this.front.trim();
		} else {
			searchText = this.back.trim();
		}
		let wordCount = searchText.split(/\s+/);
		if (wordCount.length === 1) {
			return "&query=" + searchText;
		}
	}
});

/*
 * ############################################################################
 * cardHintContent
 * ############################################################################
 */

Template.cardHintContent.helpers({
	getHint: function () {
		if (Route.isEditMode()) {
			return Session.get('hintText');
		} else if (Route.isPresentation()) {
			return this.hint;
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
	},
	getPlaceholder: function () {
		return CardType.getPlaceholderText(2);
	},
	gotHint: function () {
		let hint;
		if (Route.isEditMode()) {
			return Session.get('hintText');
		} else if (Route.isPresentation()) {
			hint = this.hint;
		} else if (Session.get('selectedHint')) {
			hint = Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
		return hint !== '' && hint !== undefined;
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
 * cardFrontContent
 * ############################################################################
 */
Template.cardFrontContent.helpers({
	isCentered: function () {
		if (CardType.gotSidesSwapped(this.cardType)) {
			return CardVisuals.isCentered(1, this.centerTextElement);
		} else {
			return CardVisuals.isCentered(0, this.centerTextElement);
		}
	},
	gotFront: function () {
		if (Route.isEditMode()) {
			return true;
		} else {
			return this.front !== '' && this.front !== undefined;
		}
	},
	getPlaceholder: function (mode) {
		return CardType.getPlaceholderText(mode, this.cardType, this.learningGoalLevel);
	}
});

/*
 * ############################################################################
 * cardBackContent
 * ############################################################################
 */
Template.cardBackContent.helpers({
	isCentered: function () {
		if (CardType.gotSidesSwapped(this.cardType)) {
			return CardVisuals.isCentered(0, this.centerTextElement);
		} else {
			return CardVisuals.isCentered(1, this.centerTextElement);
		}
	},
	gotBack: function () {
		if (Route.isEditMode()) {
			return true;
		} else {
			return this.back !== '' && this.back !== undefined;
		}
	},
	getPlaceholder: function (mode) {
		return CardType.getPlaceholderText(mode, this.cardType);
	}
});

/*
 * ############################################################################
 * cardLectureContent
 * ############################################################################
 */
Template.cardLectureContent.helpers({
	isCentered: function () {
		return CardVisuals.isCentered(3, this.centerTextElement, this.cardType);
	},
	gotLecture: function () {
		if (Route.isEditMode()) {
			return true;
		} else {
			return this.lecture !== '' && this.lecture !== undefined;
		}
	},
	getPlaceholder: function (mode) {
		return CardType.getPlaceholderText(mode, this.cardType);
	}
});

/*
 * ############################################################################
 * cardHintContentPreview
 * ############################################################################
 */

Template.cardHintContentPreview.helpers({
	getPlaceholder: function (mode) {
		if (Route.isPresentation()) {
			return CardType.getPlaceholderText(mode, this.cardType);
		}
	},
	gotHint: function () {
		return this.hint !== '' && this.hint !== undefined;
	},
	isCentered: function () {
		return CardVisuals.isCentered(2, this.centerTextElement, this.cardType);
	}
});

/*
 * ############################################################################
 * flashcardContent
 * ############################################################################
 */
Template.flashcardContent.helpers({
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	isCardset: function () {
		return Route.isCardset();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	isEditMode: function () {
		return (Route.isEditMode() && !Session.get('fullscreen'));
	},
	isEditModeOrPresentation: function () {
		return Route.isEditModeOrPresentation();
	},
	box: function () {
		return Session.get("selectedBox");
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotAlternativeHintStyle: function () {
		return CardType.gotAlternativeHintStyle(this.cardType);
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	gotLecture: function () {
		return CardType.gotLecture(this.cardType);
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(this.cardType);
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	isFrontPreview: function () {
		return (Session.get('activeEditMode') === 0 && Route.isEditModeOrPresentation() && !Session.get('dictionaryPreview'));
	},
	isLecturePreview: function () {
		if (CardType.gotLecture(this.cardType)) {
			return (Session.get('activeEditMode') === 3 && Route.isEditModeOrPresentation());
		}
	},
	isDictionaryPreview: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryPreview') && Route.isEditMode();
		}
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && Route.isEditModeOrPresentation());
	},
	gotOneColumn: function () {
		return CardType.gotOneColumn(this.cardType);
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	}
});
