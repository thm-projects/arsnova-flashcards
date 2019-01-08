import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals.js";
import {CardType} from "../../../api/cardTypes";
import {Route} from "../../../api/route.js";
import '/client/thirdParty/hammer.js';
import "./content.html";
import {MarkdeepContent} from "../../../api/markdeep";
import {Dictionary} from "../../../api/dictionary";

/*
 * ############################################################################
 * cardContentActive
 * ############################################################################
 */

Template.cardContentActive.onCreated(function () {
	CardVisuals.setTextZoom();
});

Template.cardContentActive.onRendered(function () {
	CardVisuals.setMaxIframeHeight();
	CardVisuals.resizeFlashcard();
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
	'click a': function (event) {
		MarkdeepContent.anchorTarget(event);
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

Template.cardContentInactive.onRendered(function () {
	CardVisuals.setMaxIframeHeight();
	CardVisuals.resizeFlashcard();
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
