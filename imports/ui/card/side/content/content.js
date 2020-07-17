import {Template} from "meteor/templating";
import {CardVisuals} from "../../../../util/cardVisuals.js";
import {CardType} from "../../../../util/cardTypes";
import {Route} from "../../../../util/route.js";
import {MarkdeepContent} from "../../../../util/markdeep";
import {Dictionary} from "../../../../util/dictionary";
import "./content.html";

/*
 * ############################################################################
 * cardContent
 * ############################################################################
 */

Template.cardContent.onCreated(function () {
	CardVisuals.setTextZoom();
});

Template.cardContent.onRendered(function () {
	CardVisuals.setMaxIframeHeight();
	CardVisuals.resizeFlashcard();
});

Template.cardContent.helpers({
	isQuestionSide: function () {
		return CardType.isSideWithAnswers(this);
	},
	isAnswerSide: function () {
		return CardType.isSideWithAnswers(this, false);
	},
	isCentered: function () {
		return CardVisuals.isCentered(CardType.getContentID(this), this.centerTextElement);
	},
	isLeftAlign: function () {
		return CardVisuals.isLeftAlign(CardType.getContentID(this), this.alignType);
	},
	gotContent: function () {
		Dictionary.initializeQuery(this);
		if (!Route.isCardset()) {
			return true;
		} else {
			switch (CardType.getContentID(this)) {
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
		switch (CardType.getContentID(this)) {
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
		return CardType.getPlaceholderText(CardType.getContentID(this), this.cardType, this.learningGoalLevel);
	}
});

Template.cardContent.events({
	'click a': function (event) {
		MarkdeepContent.getLinkTarget(event);
	}
});
