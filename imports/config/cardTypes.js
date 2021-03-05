//-1: Repetitorium, only used for the card type dropdown
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
//20: Quiz
let cardTypesWithDictionary = [];
let cardTypesWithDifficultyLevel = [0, 1, 3, 5, 6, 7, 11, 12, 13, 15, 17, 18, 20];
let cardTypesWithLearningModes = [0, 1, 3, 4, 5, 6, 11, 12, 13, 15, 16, 17, 20];
// Moves the card to box6 (learned) if the user answers it right
let cardTypesWithNonRepeatingLeitner = [];
let cardTypesWithLearningGoal = [0, 5, 12];
let cardTypesWithLearningUnit = [2];
let cardTypesWithNotesForDifficultyLevel = [];
let cardTypesWithCardsetTitleNavigation = [14];
let cardTypesWithSwapAnswerQuestionButton = [1, 17];
let cardTypesWithDefaultMobilePreview = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20];
let cardTypesWithMarkdeepHelp = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20];
let cardTypesWithLearningModePDFAutoTarget = [0];
let cardTypesWithTranscriptBonus = [19];
let lecturerExclusiveCardTypes = [19];
let cardTypesWithArsnovaClick = [14, 18];
let cardTypesWithFragJetzt = [14, 18];
let transcriptModeOnlyCardTypes = [2, 19];

// MC Questions
let cardTypesWithAnswerOptions = [11];
let cardTypesWithNoSideContent = [11];

let cardTypesOrder = [
	{
		cardType: 8, //8: Notizen
		enabled: true
	},
	{
		cardType: 2, //2: Mitschrift
		enabled: true,
		useCaseOnly: true
	},
	{
		cardType: 0, //0: Lerneinheit
		enabled: true
	},
	{
		cardType: 11, //11: MC-Quiz
		enabled: true
	},
	{
		cardType: 20, //11: Quiz
		enabled: true
	},
	{
		cardType: 3, //3: Glossar
		enabled: true
	},
	{
		cardType: 6, //6: Anweisungssatz
		enabled: true
	},
	{
		cardType: 13, //13: Formelsammlung
		enabled: true
	},
	{
		cardType: 15, //15: Aufgabensammlung
		enabled: true
	},
	{
		cardType: 12, //12: Entwurfsmuster
		enabled: true
	},
	{
		cardType: 1, //1: Vokabelkartei
		enabled: true
	},
	{
		cardType: 5, //5: Prüfung
		enabled: true
	},
	{
		cardType: 14, //14: Vortrag
		enabled: true
	},
	{
		cardType: 18, //18: Cube
		enabled: true
	},
	{
		cardType: -1, //-1: Repetitorium
		enabled: true
	},
	{
		cardType: 19, //19: Vorlesung mit Bonus-Mitschrift
		enabled: true
	},
	{
		cardType: 17, //17: Inverses Fragen
		enabled: false
	},
	{
		cardType: 16, //16: Zielerreichung
		enabled: false
	},
	{
		cardType: 7, //7: Literatur
		enabled: false
	},
	{
		cardType: 4, //4: Zitatensammlung
		enabled: false
	}
];

//0: left
//1: center
//2: right
//3: justify
let defaultTextAlign = 0;
let defaultCentered = true;
let swapAnserQuestionCardTypeResult = [];

// gotPDFAutoTarget
//Requires card type to be listed in cardTypesWithLearningModePDFAutoTarget. Only returns the first pdf markdeep result.

let cardTypeVariables = [
	//0: Lerneinheit
	{
		// In Minutes
		learningTime: {
			initial: 30,
			repeated: 3
		}
	},
	//1: Vokabelkartei
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//2: Mitschrift
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//3: Glossar
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//4: Zitatensammlung
	{
		// In Seconds
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//5: Prüfung
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//6: Anweisungssatz
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//7: Literatur
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//8: Notizen
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//9: To-dos
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//10: Fotokartei
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//11: MC-Quiz
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//12: Entwurfsmuster
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//13: Formelsammlung
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//14: Vortrag
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//15: Aufgabensammlung
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//16: Zielerreichung
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//17: Inverses Fragen
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//18: Cube
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//19: Vorlesung mit Bonus-Mitschrift
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	},
	//20: Quiz
	{
		// In Minutes
		learningTime: {
			initial: 3,
			repeated: 0.5
		}
	}
];

let cardTypeCubeSides = [
	//0: Lerneinheit
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"gotLearningGoalPlaceholder": true,
			"gotPDFAutoTarget": true,
			"gotQuestion": true // Displays answers after the markdeep content
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
			"isAnswerFocus": true // Jumps to answer and display answer result before markdeep content
		},
		{
			"contentId": 5,
			"defaultStyle": "default"
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
			"gotLearningGoalPlaceholder": true,
			"gotQuestion": true // Displays answers after the markdeep content
		},
		{
			"contentId": 2,
			"defaultStyle": "default",
			"isAnswer": true,
			"isAnswerFocus": true // Jumps to answer and display answer result before markdeep content
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
	//8: Notizen
	[
		{
			"contentId": 1,
			"defaultStyle": "default"
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
			"defaultStyle": "default",
			"gotQuestion": true // Displays answers after the markdeep content
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
	],
	//20: Quiz
	[
		{
			"contentId": 1,
			"defaultStyle": "default",
			"gotQuestion": true // Displays answers after the markdeep content
		},
		{
			"contentId": 2,
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
	cardTypesWithNonRepeatingLeitner,
	cardTypesWithLearningGoal,
	cardTypesWithLearningUnit,
	cardTypesWithNotesForDifficultyLevel,
	cardTypesWithCardsetTitleNavigation,
	cardTypesWithSwapAnswerQuestionButton,
	cardTypesWithDefaultMobilePreview,
	cardTypesWithMarkdeepHelp,
	cardTypesWithLearningModePDFAutoTarget,
	cardTypesWithAnswerOptions,
	cardTypesWithArsnovaClick,
	cardTypesWithFragJetzt,
	cardTypesOrder,
	defaultTextAlign,
	defaultCentered,
	swapAnserQuestionCardTypeResult,
	cardTypeCubeSides,
	cardTypesWithTranscriptBonus,
	lecturerExclusiveCardTypes,
	cardTypeVariables,
	transcriptModeOnlyCardTypes,
	cardTypesWithNoSideContent
};
