import {Session} from "meteor/session";
import {Cardsets} from "./cardsets.js";

//0: Lernkartei / Flashcard
//1: Vokabelkartei / Vocabulary
//2: Mitschrift / Notes
//3: Glossar / Glossary
//4: Zitatensammlung / Citation
//5: Prüfung / Exam
//6: Anweisungssatz / Command set
//7: Abstract
//8: Notizen / Notes
//9: To-dos / To-do
//10: Fotokartei / Photo library
//11: Quiz
//12: Entwurfsmuster / Design pattern
//13: Formelsammlung / Formulary
//14: Vortrag
//15: Aufgabensammlung
let cardTypesWithDictionary = [1];
let cardTypesWithDifficultyLevel = [0, 1, 2, 3, 5, 6, 11, 12, 13, 15];
let cardTypesWithLearningModes = [0, 1, 3, 4, 5, 6, 11, 12, 13, 15];
let cardTypesWithLearningGoal = [0, 5, 12];
let cardTypesWithLearningUnit = [];
let cardTypesWithPresentationMode = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15];
let cardTypesWithContrastButton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
let cardTypesWithNotesForDifficultyLevel = [2];
let cardTypesWithCardsetTitleNavigation = [14];
let cardTypesWithSwapAnswerQuestionButton = [1, 3, 6];
let cardTypesOrder = [{cardType: 2}, {cardType: 0}, {cardType: 15}, {cardType: 3}, {cardType: 6}, {cardType: 13}, {cardType: 12}, {cardType: 11}, {cardType: 5}, {cardType: 1}, {cardType: 10}, {cardType: 7}, {cardType: 4}, {cardType: 8}, {cardType: 9}, {cardType: 14}];

//0: left
//1: center
//2: right
//3: justify
let defaultTextAlign = 0;
let defaultCentered = true;
let swapAnserQuestionCardTypeResult = [];

let cardTypeCubeSides = [
	//0: Lernkartei / Flashcard
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 4,
			"side": "right",
			"defaultStyle": "lecture",
			"isAnswer": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true
		}

	],
	//1: Vokabelkartei / Vocabulary
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultTextAlign": "center"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultTextAlign": "center",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//2: Mitschrift / Notes
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default"
		}
	],
	//3: Glossar / Glossary
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultTextAlign": "center"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultTextAlign": "center",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//4: Zitatensammlung / Citation
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//5: Prüfung / Exam
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//6: Anweisungssatz / Command set
	[
		{
			"contentId": 2,
			"side": "front",
			"defaultStyle": "default"
		},
		{
			"contentId": 1,
			"side": "back",
			"defaultStyle": "default",
			"defaultTextAlign": "center",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//7: Abstract
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default"
		}
	],
	//8: Notizen / Notes
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "post-it"
		}
	],
	//9: To-dos / To-do
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "pink"
		}
	],
	//10: Fotokartei / Photo library
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "white"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "white"
		}
	],
	//11: Quiz
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//12: Entwurfsmuster / Design pattern
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"side": "right",
			"defaultStyle": "default"
		},
		{
			"contentId": 4,
			"side": "back",
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 5,
			"side": "top",
			"defaultStyle": "default",
			"isAnswer": true
		},
		{
			"contentId": 6,
			"side": "bottom",
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//13: Formelsammlung / Formulary
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"isAnswer": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 4,
			"side": "right",
			"defaultStyle": "default",
			"isAnswer": true
		}

	],
	//14: Vortrag
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "white"
		}

	],
	//15: Aufgabensammlung
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	]
];

export let CardType = class CardType {
	static getCardTypesOrder () {
		return cardTypesOrder;
	}

	static getCardTypeCubeSides (cardType) {
		return cardTypeCubeSides[cardType];
	}

	static getCardTypesWithLearningModes () {
		return cardTypesWithLearningModes;
	}

	static getCardTypesWithDifficultyLevel () {
		return cardTypesWithDifficultyLevel;
	}

	static isCardTypesWithSwapAnswerQuestionButton (cardType) {
		return cardTypesWithSwapAnswerQuestionButton.includes(cardType);
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
			if (type) {
				return cubeSides[0].defaultStyle;
			} else {
				return cubeSides[0].contentId;
			}
		}
	}

	static getSortQuery (cardType) {
		let sortQuery = {};
		sortQuery.subject = 1;
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

	static gotLearningUnit (cardType) {
		return cardTypesWithLearningUnit.includes(cardType);
	}

	static gotLearningGoal (cardType) {
		return cardTypesWithLearningGoal.includes(cardType);
	}

	static gotCardsetTitleNavigation (cardType) {
		return cardTypesWithCardsetTitleNavigation.includes(cardType);
	}

	static gotCardTypesWithSwapAnswerQuestionButton (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {shuffled: 1, cardGroups: 1, cardType: 1}});
		if (cardset !== undefined) {
			swapAnserQuestionCardTypeResult = [];
			let foundCardset = false;
			if (cardset.shuffled) {
				for (let i = 0, cardGroupsLength = cardset.cardGroups.length; i < cardGroupsLength; i++) {
					let cardType = Cardsets.findOne({_id: cardset.cardGroups[i]}).cardType;
					if (cardTypesWithSwapAnswerQuestionButton.includes(cardType)) {
						if (!swapAnserQuestionCardTypeResult.includes(cardType)) {
							swapAnserQuestionCardTypeResult.push(cardType);
						}
						foundCardset = true;
					}
				}
			} else {
				foundCardset = cardTypesWithSwapAnswerQuestionButton.includes(cardset.cardType);
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
			for (let i = 0, cardTypeLength = swapAnserQuestionCardTypeResult.length; i < cardTypeLength; i++) {
				array.push(TAPi18n.__('card.cardType' + swapAnserQuestionCardTypeResult[i] + '.name'));
			}
			array.sort();
		} else {
			for (let i = 0, cardTypesOrderLength = cardTypesOrder.length; i < cardTypesOrderLength; i++) {
				for (let k = 0, cardTypeLength = swapAnserQuestionCardTypeResult.length; k < cardTypeLength; k++) {
					if (cardTypesOrder[i].cardType === swapAnserQuestionCardTypeResult[k]) {
						array.push(TAPi18n.__('card.cardType' + swapAnserQuestionCardTypeResult[k] + '.name'));
					}
				}
			}
		}
		return array.join(TAPi18n.__('card.tooltip.swapQuestionAnswer.listSeparator'));
	}

	static gotLearningModes (cardType) {
		return cardTypesWithLearningModes.includes(cardType);
	}

	static gotPresentationMode (cardType) {
		return cardTypesWithPresentationMode.includes(cardType);
	}

	static gotDifficultyLevel (cardType) {
		return cardTypesWithDifficultyLevel.includes(cardType);
	}

	static gotContrastButton (cardType) {
		return cardTypesWithContrastButton.includes(cardType);
	}

	static withDifficultyLevel () {
		return cardTypesWithDifficultyLevel;
	}

	static gotNotesForDifficultyLevel (cardType) {
		return cardTypesWithNotesForDifficultyLevel.includes(cardType);
	}

	static gotDictionary (cardType) {
		return cardTypesWithDictionary.includes(cardType);
	}

	static setDefaultCenteredText (cardType, returnValue = undefined) {
		let centerTextElement = Array(6).fill(defaultCentered);
		let textAlignType = Array(6).fill(defaultTextAlign);
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
								textAlignType[i] = defaultTextAlign;
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
};
