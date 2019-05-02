//0: Lerneinheit
//1: Vokabelkartei
//2: Mitschrift
//3: Glossar
//4: Zitatensammlung
//5: Prüfung
//6: Anweisungssatz
//7: Literatur
//8: Notizen
//9: To-dos
//10: Fotokartei
//11: Quiz
//12: Entwurfsmuster
//13: Formelsammlung
//14: Vortrag
//15: Aufgabensammlung
//16: Zielerreichung
//17: Inverses Fragen
//18: Cube
//19: Vorlesung mit Bonus-Mitschrift
let cardTypesWithDictionary = [1];
let cardTypesWithDifficultyLevel = [0, 1, 3, 5, 6, 7, 11, 12, 13, 15, 17, 18];
let cardTypesWithLearningModes = [0, 1, 3, 4, 5, 6, 11, 12, 13, 15, 16, 17];
let cardTypesWithLearningGoal = [0, 5, 12];
let cardTypesWithLearningUnit = [2];
let cardTypesWithNotesForDifficultyLevel = [];
let cardTypesWithCardsetTitleNavigation = [14];
let cardTypesWithSwapAnswerQuestionButton = [1, 17];
let cardTypesWithDefaultMobilePreview = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
let cardTypesWithMarkdeepHelp = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
let cardTypesWithTranscriptBonus = [19];
let cardTypesOrder = [
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
	{cardType: 14},
	{cardType: 18},
	{cardType: 19}
];

//0: left
//1: center
//2: right
//3: justify
let defaultTextAlign = 0;
let defaultCentered = true;
let swapAnserQuestionCardTypeResult = [];

let cardTypeCubeSides = [
	//0: Lerneinheit
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 4,
			"defaultStyle": "default",
			"isAnswer": true
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"defaultStyle": "default",
			"isAnswer": true
		}

	],
	//1: Vokabelkartei
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"defaultTextAlign": "center"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"defaultTextAlign": "center",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//2: Mitschrift
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"defaultStyle": "default"
		}
	],
	//3: Glossar
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"defaultTextAlign": "center"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"defaultTextAlign": "center",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//4: Zitatensammlung
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//5: Prüfung
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//6: Anweisungssatz
	[
		{
			"contentId": 2,
			"defaultStyle": "default"
		},
		{
			"contentId": 1,
			"defaultStyle": "default",
			"defaultTextAlign": "center",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 3,
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//7: Literatur
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"defaultTextAlign": "center"
		},
		{
			"contentId": 3,
			"defaultStyle": "default"
		},
		{
			"contentId": 4,
			"defaultStyle": "default"
		},
		{
			"contentId": 5,
			"defaultStyle": "default"
		},
		{
			"contentId": 6,
			"defaultStyle": "default"
		}
	],
	//8: Notizen
	[
		{
			"contentId": 1,
			"defaultStyle": "post-it"
		}
	],
	//9: To-dos
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		}
	],
	//10: Fotokartei
	[
		{
			"contentId": 1,
			"defaultStyle": "white"
		},
		{
			"contentId": 2,
			"defaultStyle": "white"
		}
	],
	//11: Quiz
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//12: Entwurfsmuster
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"defaultStyle": "default"
		},
		{
			"contentId": 4,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 5,
			"defaultStyle": "default",
			"isAnswer": true
		},
		{
			"contentId": 6,
			"defaultStyle": "default",
			"isAnswer": true
		}
	],
	//13: Formelsammlung
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true
		},
		{
			"contentId": 3,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		},
		{
			"contentId": 4,
			"defaultStyle": "default",
			"isAnswer": true
		}

	],
	//14: Vortrag
	[
		{
			"contentId": 1,
			"defaultStyle": "white"
		}

	],
	//15: Aufgabensammlung
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//16: Zielerreichung
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//17: Inverses Fragen
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true
		}
	],
	//18: Kubus
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"defaultStyle": "default"
		},
		{
			"contentId": 4,
			"defaultStyle": "default"
		},
		{
			"contentId": 5,
			"defaultStyle": "default"
		},
		{
			"contentId": 6,
			"defaultStyle": "default"
		}
	],
	//19: Vorlesung mit Bonus-Mitschrift
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
		},
		{
			"contentId": 2,
			"defaultStyle": "default"
		},
		{
			"contentId": 3,
			"defaultStyle": "default"
		},
		{
			"contentId": 4,
			"defaultStyle": "default"
		},
		{
			"contentId": 5,
			"defaultStyle": "default"
		},
		{
			"contentId": 6,
			"defaultStyle": "default"
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
	cardTypeCubeSides,
	cardTypesWithTranscriptBonus
};
