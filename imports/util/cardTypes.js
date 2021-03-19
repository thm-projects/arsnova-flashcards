import {Session} from "meteor/session";
import {Cardsets} from "../api/subscriptions/cardsets.js";
import * as config from "../config/cardTypes.js";
import {CardNavigation} from "./cardNavigation";
import {Route} from "./route";
import {NavigatorCheck} from "./navigatorCheck";

export let CardType = class CardType {
	static getCardTypesOrder () {
		return config.cardTypesOrder;
	}

	static getCardTypeCubeSides (cardType) {
		return config.cardTypeCubeSides[cardType];
	}

	static hasCardTwoSides (feature, cardType) {
		return NavigatorCheck.gotFeatureSupport(feature) && config.cardTypeCubeSides[cardType].length === 2;
	}

	static getCardTypeVariables (cardType) {
		return config.cardTypeVariables[cardType];
	}

	static getCardTypesWithLearningModes () {
		return config.cardTypesWithLearningModes;
	}

	static isLecturerExclusive () {
		return config.lecturerExclusiveCardTypes;
	}

	static getCardTypesWithDifficultyLevel () {
		return config.cardTypesWithDifficultyLevel;
	}

	static getCardTypesWithTranscriptBonus () {
		return config.cardTypesWithTranscriptBonus;
	}

	static isCardTypesWithSwapAnswerQuestionButton (cardType) {
		return config.cardTypesWithSwapAnswerQuestionButton.includes(cardType);
	}

	/**
	 *
	 * @param cubeSides = The cube sides of the card
	 * @param cardType = The card type
	 * @param type = 0 = return the content ID, 1 = return the style
	 * @returns {*}
	 */
	static getActiveSideData (cubeSides, cardType, type = 0) {
		if (Session.get('swapAnswerQuestion') && this.isCardTypesWithSwapAnswerQuestionButton(cardType)) {
			for (let i = 0, cubeSidesLength = cubeSides.length; i < cubeSidesLength; i++) {
				if (cubeSides[i].isAnswerFocus) {
					if (type) {
						return cubeSides[i].defaultStyle;
					} else {
						return cubeSides[i].contentId;
					}
				}
			}
		} else {
			let index = CardNavigation.getCardSideNavigationIndex() - 1;
			if (index === undefined || index < 0 || index > cubeSides.length) {
				index = 0;
			}
			if (type) {
				return cubeSides[index].defaultStyle;
			} else {
				return cubeSides[index].contentId;
			}
		}
	}

	static getSortQuery (cardType, sortType) {
		let sortQuery = {};
		sortQuery.subject = 1;
		if (sortType === 0) {
			if (this.gotAnswerOptions(cardType) && this.gotNoSideContent(cardType)) {
				sortQuery['answers.question'] = 1;
			} else {
				let cubeSides = this.getCardTypeCubeSides(cardType);
				switch (cubeSides[0].contentId) {
					case 1:
						sortQuery.front = 1;
						break;
					case 2:
						sortQuery.back = 1;
						break;
					case 3:
						sortQuery.hint = 1;
						break;
					case 4:
						sortQuery.lecture = 1;
						break;
					case 5:
						sortQuery.top = 1;
						break;
					case 6:
						sortQuery.bottom = 1;
						break;
				}
			}
		} else {
			sortQuery.date = 1;
		}
		return sortQuery;
	}

	static contentWithLearningGoalPlaceholder (contentId, cardType) {
		let cubeSides = this.getCardTypeCubeSides(cardType);
		for (let i = 0, cubeSidesLength = cubeSides.length; i < cubeSidesLength; i++) {
			if (cubeSides[i].contentId === contentId) {
				return cubeSides[i].gotLearningGoalPlaceholder;
			}
		}
	}

	static getContentIDTranslation (id) {
		switch (id) {
			case 1:
				return "front";
			case 2:
				return "back";
			case 3:
				return "hint";
			case 4:
				return "lecture";
			case 5:
				return "top";
			case 6:
				return "bottom";
		}
	}

	static getCubeSideID (side) {
		switch (side) {
			case "front":
				return 0;
			case "right":
				return 1;
			case "back":
				return 2;
			case "left":
				return 3;
			case "top":
				return 4;
			case "bottom":
				return 5;
		}
	}

	static getCubeSideName (id) {
		switch (id) {
			case 1:
				return 'front';
			case 2:
				return 'right';
			case 3:
				return 'back';
			case 4:
				return 'left';
			case 5:
				return 'top';
			case 6:
				return 'bottom';
		}
	}

	static getSideData (cardType, forceSide) {
		let sides = this.getCardTypeCubeSides(cardType);
		let id = this.getCubeSideID(forceSide);
		return sides[id];
	}

	static getContentID (card) {
		if (card.forceSide !== undefined) {
			let sideData = this.getSideData(card.cardType, card.forceSide);
			if (sideData !== undefined) {
				return sideData.contentId;
			}
		} else {
			if (card.isActive) {
				return Session.get('activeCardContentId');
			} else {
				return this.getCardTypeCubeSides(card.cardType)[0].contentId;
			}
		}
	}

	static isSideWithAnswers (card, isQuestionSide = true) {
		let sideData;
		let forceSide = card.forceSide;
		if (forceSide === undefined && ((card._id === Session.get('activeCard')) || (Route.isNewCard() && !Session.get('is3DActive')))) {
			forceSide = this.getCubeSideName(Session.get('activeCardContentId'));
		} else if (forceSide === undefined) {
			forceSide = 'front';
		}
		sideData = this.getSideData(card.cardType, forceSide);
		if (sideData !== undefined) {
			if (isQuestionSide) {
				return sideData.gotQuestion === true;
			} else {
				return sideData.isAnswerFocus === true;
			}
		}
	}

	static getContentStyle (cardType, forceSide) {
		let sideData = this.getSideData(cardType, forceSide);
		if (sideData !== undefined) {
			return sideData.defaultStyle;
		}
	}

	static gotLearningUnit (cardType) {
		return config.cardTypesWithLearningUnit.includes(cardType);
	}

	static gotTranscriptBonus (cardType) {
		return config.cardTypesWithTranscriptBonus.includes(cardType);
	}

	static gotLearningGoal (cardType) {
		return config.cardTypesWithLearningGoal.includes(cardType);
	}

	static gotCardsetTitleNavigation (cardType) {
		return config.cardTypesWithCardsetTitleNavigation.includes(cardType);
	}

	static gotDefaultMobilePreview (cardType) {
		return config.cardTypesWithDefaultMobilePreview.includes(cardType);
	}

	static gotAnswerOptions (cardType) {
		return config.cardTypesWithAnswerOptions.includes(cardType);
	}

	static gotNoSideContent (cardType) {
		return config.cardTypesWithNoSideContent.includes(cardType);
	}

	static gotMarkdeepHelp (cardType) {
		return config.cardTypesWithMarkdeepHelp.includes(cardType);
	}

	static gothLearningModePDFAutoTarget (cardType) {
		return config.cardTypesWithLearningModePDFAutoTarget.includes(cardType);
	}

	static gotArsnovaClick (cardType) {
		return config.cardTypesWithArsnovaClick.includes(cardType);
	}

	static gotFragJetzt (cardType) {
		return config.cardTypesWithFragJetzt.includes(cardType);
	}

	static isTranscriptModeOnlyCardType (cardType) {
		return config.transcriptModeOnlyCardTypes.includes(cardType);
	}

	static gotCardTypesWithSwapAnswerQuestionButton (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {shuffled: 1, cardGroups: 1, cardType: 1}});
		if (cardset !== undefined) {
			let swapAnserQuestionCardTypeResult = [];
			let foundCardset = false;
			if (cardset.shuffled) {
				for (let i = 0, cardGroupsLength = cardset.cardGroups.length; i < cardGroupsLength; i++) {
					let cardType = Cardsets.findOne({_id: cardset.cardGroups[i]}).cardType;
					if (config.cardTypesWithSwapAnswerQuestionButton.includes(cardType)) {
						if (!swapAnserQuestionCardTypeResult.includes(cardType)) {
							swapAnserQuestionCardTypeResult.push(cardType);
						}
						foundCardset = true;
					}
				}
			} else {
				foundCardset = config.cardTypesWithSwapAnswerQuestionButton.includes(cardset.cardType);
				if (foundCardset) {
					swapAnserQuestionCardTypeResult.push(cardset.cardType);
				}
			}
			return foundCardset;
		}
	}

	/**
	 * Returns a description of all card types that can swap their answer and question
	 * @param sortMode: 0 = Sort by name, 1 = Sort by card Type Order
	 * @returns {string}
	 */
	static getCardTypesWithSwapAnswerQuestionTooltip (sortMode = 0) {
		let array = [];
		if (sortMode === 0) {
			for (let i = 0, cardTypeLength = config.swapAnserQuestionCardTypeResult.length; i < cardTypeLength; i++) {
				array.push(TAPi18n.__('card.cardType' + config.swapAnserQuestionCardTypeResult[i] + '.name'));
			}
			array.sort();
		} else {
			for (let i = 0, cardTypesOrderLength = config.cardTypesOrder.length; i < cardTypesOrderLength; i++) {
				for (let k = 0, cardTypeLength = config.swapAnserQuestionCardTypeResult.length; k < cardTypeLength; k++) {
					if (config.cardTypesOrder[i].cardType === config.swapAnserQuestionCardTypeResult[k]) {
						array.push(TAPi18n.__('card.cardType' + config.swapAnserQuestionCardTypeResult[k] + '.name'));
					}
				}
			}
		}
		return array.join(TAPi18n.__('card.tooltip.swapQuestionAnswer.listSeparator'));
	}

	static gotLearningModes (cardType) {
		return config.cardTypesWithLearningModes.includes(cardType);
	}

	static gotNonRepeatingLeitner (cardType) {
		return config.cardTypesWithNonRepeatingLeitner.includes(cardType);
	}

	static gotDifficultyLevel (cardType) {
		return config.cardTypesWithDifficultyLevel.includes(cardType);
	}

	static gotNotesForDifficultyLevel (cardType) {
		return config.cardTypesWithNotesForDifficultyLevel.includes(cardType);
	}

	static gotDictionary (cardType) {
		return config.cardTypesWithDictionary.includes(cardType);
	}

	static setDefaultCenteredText (cardType, returnValue = undefined) {
		let centerTextElement = Array(6).fill(config.defaultCentered);
		let textAlignType = Array(6).fill(config.defaultTextAlign);
		let cubeSides = this.getCardTypeCubeSides(cardType);
		for (let i = 0, centerTextElementLength = centerTextElement.length; i < centerTextElementLength; i++) {
			for (let l = 0, cubeSidesLength = cubeSides.length; l < cubeSidesLength; l++) {
				if (cubeSides[l].contentId === (i + 1)) {
					if (cubeSides[l].defaultCentered !== undefined) {
						centerTextElement[i] = cubeSides[l].defaultCentered;
					}
					if (cubeSides[l].defaultTextAlign !== undefined) {
						switch (cubeSides[l].defaultTextAlign) {
							case "left":
								textAlignType[i] = 0;
								break;
							case "center":
								textAlignType[i] = 1;
								break;
							case "right":
								textAlignType[i] = 2;
								break;
							case "justify":
								textAlignType[i] = 3;
								break;
							case "default":
								textAlignType[i] = config.defaultTextAlign;
								break;
						}
					}
				}
			}
		}
		if (returnValue !== undefined) {
			switch (returnValue) {
				case 1:
					return centerTextElement;
				case 2:
					return textAlignType;
			}
		} else {
			Session.set('centerTextElement', centerTextElement);
			Session.set('alignType', textAlignType);
		}
	}


	static getSubjectPlaceholderLabel (cardType = -1) {
		return TAPi18n.__('card.cardType' + cardType + '.editorLabels.subject');
	}

	static getSubjectPlaceholderText (cardType = -1) {
		return TAPi18n.__('card.cardType' + cardType + '.placeholders.subject');
	}

	static getPlaceholderText (contentId = -1, cardType = -1, learningGoalLevel = -1) {
		if (contentId < 0) {
			contentId = Session.get('activeCardContentId');
		}
		if (cardType < 0) {
			cardType = Session.get('cardType');
		}
		if (this.gotLearningGoal(cardType) && this.contentWithLearningGoalPlaceholder(contentId, cardType)) {
			return TAPi18n.__('learning-goal.level' + (++learningGoalLevel) + 'Placeholder');
		}
		return TAPi18n.__('card.cardType' + cardType + '.placeholders.content' + contentId);
	}

	static getCardTypeName (cardType) {
		if (cardType < 0) {
			return TAPi18n.__('card.chooseCardType');
		} else {
			return TAPi18n.__('card.cardType' + cardType + '.name');
		}
	}

	static getCardTypeLongName (cardType) {
		if (cardType < 0) {
			return TAPi18n.__('card.chooseCardType');
		} else {
			return TAPi18n.__('card.cardType' + cardType + '.longName');
		}
	}

	static sideGotVisibleAnswers (card, side) {
		if (card !== undefined) {
			if (card.cardType !== undefined && this.gotAnswerOptions(card.cardType) && this.gotNoSideContent(card.cardType)) {
				return true;
			} else if (card.answers !== undefined && card.answers.content !== undefined) {
				let sideData = this.getSideData(card.cardType, side);
				if (sideData !== undefined && (sideData.gotQuestion === true || sideData.isAnswerFocus === true) && card.answers.content.length > 0) {
					return true;
				}
			}
		}
	}

	static getAnswerSideID (cardType) {
		let sides = this.getCardTypeCubeSides(cardType);
		for (let i = 0; i < sides.length; i++) {
			if (sides[i].isAnswerFocus) {
				return i + 1;
			}
		}
		return 1;
	}
};
