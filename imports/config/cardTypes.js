//0: Lernkartei / flash card index
//1: Vokabelkartei / vocabulary
//2: Mitschrift / notes
//3: Glossar / glossary
//4: Zitatensammlung / citations
//5: Prüfung / exam
//6: Anweisungssatz / command set
//7: Abstract
//8: Notizen / notes
//9: To-dos / to-dos
//10: Fotokartei / photo library
//11: Quiz
//12: Entwurfsmuster / design patterns
//13: Formelsammlung / collection of formulas
//14: Vortrag / talk
//15: Aufgabensammlung / task collection
//16: Zielerreichung / goal achievement
//17: Inverses Fragen / inverse questioning
let cardTypesWithDictionary = [1];
let cardTypesWithDifficultyLevel = [0, 1, 2, 3, 5, 6, 11, 12, 13, 15, 17];
let cardTypesWithLearningModes = [0, 1, 3, 4, 5, 6, 11, 12, 13, 15, 16, 17];
let cardTypesWithLearningGoal = [0, 5, 12];
let cardTypesWithLearningUnit = [];
let cardTypesWithNotesForDifficultyLevel = [2];
let cardTypesWithCardsetTitleNavigation = [14];
let cardTypesWithSwapAnswerQuestionButton = [1, 17];
let cardTypesWithDefaultMobilePreview = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
let cardTypesWithMarkdeepHelp = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
let cardTypesOrder = [
	{cardType: 2},
	{cardType: 0},
	{cardType: 15},
	{cardType: 3},
	{cardType: 6},
	{cardType: 13},
	{cardType: 12},
	{cardType: 17},
	{cardType: 16},
	{cardType: 11},
	{cardType: 5},
	{cardType: 1},
	{cardType: 10},
	{cardType: 7},
	{cardType: 4},
	{cardType: 8},
	{cardType: 9},
	{cardType: 14}
];

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
			"defaultStyle": "default",
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
			"defaultStyle": "default"
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
	],
	//16: Zielerreichung
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
	//17: Inverses Fragen
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
	]
];

module.exports = {
	cardTypesWithDictionary,
	cardTypesWithDifficultyLevel,
	cardTypesWithLearningModes,
	cardTypesWithLearningGoal,
	cardTypesWithLearningUnit,
	cardTypesWithNotesForDifficultyLevel,
	cardTypesWithCardsetTitleNavigation,
	cardTypesWithSwapAnswerQuestionButton,
	cardTypesWithDefaultMobilePreview,
	cardTypesWithMarkdeepHelp,
	cardTypesOrder,
	defaultTextAlign,
	defaultCentered,
	swapAnserQuestionCardTypeResult,
	cardTypeCubeSides
};
