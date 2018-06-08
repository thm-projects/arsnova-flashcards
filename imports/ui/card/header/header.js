import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import {CardVisuals} from "../../../api/cardVisuals";
import {CardType} from "../../../api/cardTypes";
import "./header.html";
import "./left/headerLeft.js";
import "./right/headerRight.js";
import "./item/headerItemCardList.js";
import "./center/headerCenter.js";
import "./item/headerItemClock.js";
import "./item/headerItemCopy.js";
import "./item/headerItemCountCards.js";
import "./item/headerItemCountCardsLeitner.js";
import "./item/headerItemCountCardsWozniak.js";
import "./item/headerItemDictionary.js";
import "./item/headerItemEdit.js";
import "./item/headerItemEndPresentation.js";
import "./item/headerItemHint.js";
import "./item/headerItemLecture.js";
import "./item/headerItemSwapOrder.js";
import "./item/headerItemToggleFullscreen.js";
import "./item/headerItemTurnCard.js";

/*
 * ############################################################################
 * flashcardHeader
 * ############################################################################
 */

Template.flashcardHeader.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isPresentation: function () {
		return Route.isPresentation();
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
 * flashcardHeaderDefault
 * ############################################################################
 */

Template.flashcardHeaderDefault.events({
	"click .cardHeader": function (evt) {
		CardVisuals.cardHeaderTurnCard(evt);
	}
});

/*
* ############################################################################
* flashcardHeaderPresentation
* ############################################################################
*/

Template.flashcardHeaderPresentation.helpers({
	gotAlternativeHintStyle: function () {
		return CardType.gotAlternativeHintStyle(this.cardType);
	},
	isHintPreview: function () {
		return Session.get('activeEditMode') === 2;
	},
	isLecturePreview: function () {
		if (CardType.gotLecture(this.cardType)) {
			return Session.get('activeEditMode') === 3;
		}
	}
});

/*
* ############################################################################
* flashcardHeaderEditor
* ############################################################################
*/

Template.flashcardHeaderEditor.helpers({
	gotAlternativeHintStyle: function () {
		return CardType.gotAlternativeHintStyle(this.cardType);
	},
	isHintPreview: function () {
		return Session.get('activeEditMode') === 2;
	},
	isLecturePreview: function () {
		if (CardType.gotLecture(this.cardType)) {
			return Session.get('activeEditMode') === 3;
		}
	}
});

/*
* ############################################################################
* flashcardHeaderLeitner
* ############################################################################
*/

Template.flashcardHeaderLeitner.events({
	"click .cardHeader": function (evt) {
		CardVisuals.cardHeaderTurnCard(evt);
	}
});

/*
* ############################################################################
* flashcardHeaderWozniak
* ############################################################################
*/

Template.flashcardHeaderWozniak.events({
	"click .cardHeader": function (evt) {
		CardVisuals.cardHeaderTurnCard(evt);
	}
});
