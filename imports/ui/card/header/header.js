import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import {CardVisuals} from "../../../api/cardVisuals";
import {CardType} from "../../../api/cardTypes";
import "./header.html";
import "./left/left.js";
import "./right/right.js";
import "./item/cardList.js";
import "./center/center.js";
import "./item/clock.js";
import "./item/copy.js";
import "./item/countCards.js";
import "./item/countCardsLeitner.js";
import "./item/dictionary.js";
import "./item/edit.js";
import "./item/endPresentation.js";
import "./item/hint.js";
import "./item/lecture.js";
import "./item/swapOrder.js";
import "./item/toggleFullscreen.js";
import "./item/turnCard.js";

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
* flashcardHeaderDemo
* ############################################################################
*/

Template.flashcardHeaderDemo.helpers({
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
