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
let cardTypesWithCenteredText = [1, 3, 4, 5, 6, 11];
let cardTypesWithDictionary = [1];
let cardTypesWithDifficultyLevel = [0, 1, 2, 5, 6, 11, 12];
let cardTypesWithLearningModes = [1, 3, 4, 5, 6, 11, 12];
let cardTypesWithLearningGoal = [0, 5];
let cardTypesWithLearningUnit = [];
let cardTypesWhichDisplaySideInformation = [0];
let cardTypesWhichDisplayLearningGoalInformation = [0, 5];
let cardTypesWithPresentationMode = [0, 1, 2, 3, 4, 5, 6, 7, 11, 12];
let cardTypesWithNotesForDifficultyLevel = [2];
let cardTypesWithAlternativePublishLimit = [0];
let cardTypesOrder = [{cardType: 2}, {cardType: 0}, {cardType: 3}, {cardType: 6}, {cardType: 12}, {cardType: 11}, {cardType: 5}, {cardType: 4}, {cardType: 7}, {cardType: 1}, {cardType: 8}, {cardType: 9}, {cardType: 10}];
let publishLimit = 5;
let alternativePublishLimit = 1;

let cardTypeCubeSides = [
	//0: Lernkartei / Flashcard
	[
		{
			"contentId": 1,
			"side": "front",
			"defaultStyle": "default",
			"defaultCentered": false
		},
		{
			"contentId": 4,
			"side": "right",
			"defaultStyle": "lecture",
			"defaultCentered": false
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
			"defaultStyle": "hint",
			"defaultCentered": false
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
			"isAnswer": true
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
			"defaultCentered": false,
			"isAnswer": true
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
			"isAnswer": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false
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
			"isAnswer": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false
		}
	],
	//5: Prüfung / Exam
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
			"isAnswer": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false
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
			"isAnswer": true
		},
		{
			"contentId": 3,
			"side": "left",
			"defaultStyle": "hint",
			"defaultCentered": false
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
			"defaultCentered": false,
			"isAnswer": true
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
			"defaultCentered": false,
			"isAnswer": true
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
			"isAnswer": true
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
			"contentId": 4,
			"side": "right",
			"defaultStyle": "lecture",
			"defaultCentered": false
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
			"defaultStyle": "hint",
			"defaultCentered": false
		},
		{
			"contentId": 5,
			"side": "top",
			"defaultStyle": "hint-alternative",
			"defaultCentered": false
		},
		{
			"contentId": 6,
			"side": "bottom",
			"defaultStyle": "hint-alternative",
			"defaultCentered": false
		}
	]
];

export let CardType = class CardType {
	static gotPublishLimit (cardType, cardQuantity) {
		if (cardTypesWithAlternativePublishLimit.includes(cardType)) {
			return cardQuantity >= alternativePublishLimit;
		} else {
			return cardQuantity >= publishLimit;
		}
	}
	static getCardTypesOrder () {
		return cardTypesOrder;
	}

	static getCardTypeCubeSides (cardType) {
		return cardTypeCubeSides[cardType];
	}

	static getCardTypesWithLearningModes () {
		return cardTypesWithLearningModes;
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

	static displaysSideInformation (cardType) {
		return cardTypesWhichDisplaySideInformation.includes(cardType);
	}

	static displaysLearningGoalInformation (cardType) {
		return cardTypesWhichDisplayLearningGoalInformation.includes(cardType);
	}

	static gotLearningUnit (cardType) {
		return cardTypesWithLearningUnit.includes(cardType);
	}

	static gotLearningGoal (cardType) {
		return cardTypesWithLearningGoal.includes(cardType);
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

	static gotNotesForDifficultyLevel (cardType) {
		return cardTypesWithNotesForDifficultyLevel.includes(cardType);
	}

	static gotDictionary (cardType) {
		return cardTypesWithDictionary.includes(cardType);
	}

	static defaultCenteredText (cardType) {
		if (cardTypesWithCenteredText.includes(cardType)) {
			Session.set('centerTextElement', [true, true, false, false, false, false]);
		} else {
			Session.set('centerTextElement', [false, false, false, false, false, false]);
		}
	}

	static getFrontTitle (cardType = -1) {
		let activeCardType = cardType;
		if (activeCardType === -1) {
			activeCardType = Session.get('cardType');
		}
		return TAPi18n.__('card.cardType' + activeCardType + '.content1');
	}

	static getBackTitle (cardType = -1) {
		let activeCardType = cardType;
		if (activeCardType === -1) {
			activeCardType = Session.get('cardType');
		}
		return TAPi18n.__('card.cardType' + activeCardType + '.content2');
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
		if (contentId === 0 && this.gotLearningGoal(cardType)) {
			return TAPi18n.__('learning-goal.level' + (++learningGoalLevel) + 'Placeholder');
		}
		return TAPi18n.__('card.cardType' + cardType + '.placeholders.content' + contentId);
	}

	static getCardTypeName (cardType) {
		return TAPi18n.__('card.cardType' + cardType + '.name');
	}

	static getCardTypeLongName (cardType) {
		return TAPi18n.__('card.cardType' + cardType + '.longName');
	}
};
