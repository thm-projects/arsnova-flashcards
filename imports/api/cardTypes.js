import {Session} from "meteor/session";

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
let cardTypesWithDifficultyLevel = [0, 1, 2, 5, 6, 11, 12, 13, 15];
let cardTypesWithLearningModes = [0, 1, 3, 4, 5, 6, 11, 12, 13, 15];
let cardTypesWithLearningGoal = [0, 5, 12];
let cardTypesWithLearningUnit = [];
let cardTypesWithPresentationMode = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15];
let cardTypesWithContrastButton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
let cardTypesWithNotesForDifficultyLevel = [2];
let cardTypesWithCardsetTitleNavigation = [14];
let cardTypesOrder = [{cardType: 2}, {cardType: 0}, {cardType: 15}, {cardType: 3}, {cardType: 6}, {cardType: 13}, {cardType: 12}, {cardType: 11}, {cardType: 5}, {cardType: 1}, {cardType: 10}, {cardType: 7}, {cardType: 4}, {cardType: 8}, {cardType: 9}, {cardType: 14}];

let cardTypeCubeSides = [
	//0: Lernkartei / Flashcard
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false,
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 4,
			"side": "right",
			"defaultStyle": "lecture",
			"defaultCentered": false,
			"isAnswer": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}

	],
	//1: Vokabelkartei / Vocabulary
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": true,
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//2: Mitschrift / Notes
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint-alternative",
			"defaultCentered": false
		}
	],
	//3: Glossar / Glossary
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}
	],
	//4: Zitatensammlung / Citation
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}
	],
	//5: Prüfung / Exam
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false,
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}
	],
	//6: Anweisungssatz / Command set
	[
		{
			"contentId": 2,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 1,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}
	],
	//7: Abstract
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false
		}
	],
	//8: Notizen / Notes
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "post-it",
			"defaultCentered": false
		}
	],
	//9: To-dos / To-do
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "pink",
			"defaultCentered": false
		}
	],
	//10: Fotokartei / Photo library
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "white",
			"defaultCentered": false
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "white",
			"defaultCentered": false
		}
	],
	//11: Quiz
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": true,
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//12: Entwurfsmuster / Design pattern
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 3,
			"side": "right",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 4,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 2,
			"side": "left",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 5,
			"side": "top",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true
		},
		{
			"contentId": 6,
			"side": "bottom",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}
	],
	//13: Formelsammlung / Formulary
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false,
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "default",
			"defaultCentered": false,
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 4,
			"side": "right",
			"defaultStyle": "hint",
			"defaultCentered": false,
			"isAnswer": true
		}

	],
	//14: Vortrag
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "white",
			"defaultCentered": false
		}

	],
	//15: Aufgabensammlung
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false,
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"side": "back",
			"defaultStyle": "default",
			"defaultCentered": false,
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
		for (let i = 0; i < cubeSides.length; i++) {
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

	static setDefaultCenteredText (cardType) {
		let centerTextElement = [false, false, false, false, false, false];
		let cubeSides = this.getCardTypeCubeSides(cardType);
		for (let i = 0; i < centerTextElement.length; i++) {
			for (let l = 0; l < cubeSides.length; l++) {
				if (cubeSides[l].contentId === (i + 1)) {
					centerTextElement[i] = cubeSides[l].defaultCentered;
				}
			}
		}
		Session.set('centerTextElement', centerTextElement);
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
