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
let cardTypesWithBack = [0, 1, 2, 3, 4, 5, 6, 7];
let cardTypesWithCenteredText = [1, 3, 4, 5, 6];
let cardTypesWithDictionary = [1];
let cardTypesWithDifficultyLevel = [0, 1, 2, 5];
let cardTypesWithHint = [0, 2, 3, 4, 5, 6, 7];
let cardTypesWithAlternativeHintStyle = [2];
let cardTypesWithLearningModes = [0, 1, 3, 5, 6];
let cardTypesWithLearningGoal = [0, 5];
let cardTypesWithLearningUnit = [];
let cardTypesWhichDisplaySideInformation = [0];
let cardTypesWhichDisplayLearningGoalInformation = [0, 5];
let cardTypesWithLecture = [0];
let cardTypesWithPresentationMode = [0, 1, 2, 3, 4, 5, 6, 7];
let cardTypesWithSwappedSides = [6];
let cardTypesWithNotesForDifficultyLevel = [2];
let cardTypesOrder = [{cardType: 2}, {cardType: 0}, {cardType: 3}, {cardType: 6}, {cardType: 5}, {cardType: 4}, {cardType: 7}, {cardType: 1}, {cardType: 8}, {cardType: 9}, {cardType: 10}];

class CardType {
	static getCardTypesOrder () {
		return cardTypesOrder;
	}

	static gotBack (cardType) {
		return cardTypesWithBack.includes(cardType);
	}

	static gotHint (cardType) {
		return cardTypesWithHint.includes(cardType);
	}

	static gotLecture (cardType) {
		return cardTypesWithLecture.includes(cardType);
	}

	static displaysSideInformation (cardType) {
		return cardTypesWhichDisplaySideInformation.includes(cardType);
	}

	static displaysLearningGoalInformation (cardType) {
		return cardTypesWhichDisplayLearningGoalInformation.includes(cardType);
	}

	static getColumnCount (cardType) {
		let i = 1;
		if (this.gotBack(cardType)) {
			i++;
		}
		if (this.gotHint(cardType)) {
			i++;
		}
		if (this.gotLecture(cardType)) {
			i++;
		}
		return i;
	}

	static gotFourColumns (cardType) {
		return this.getColumnCount(cardType) === 4;
	}

	static gotThreeColumns (cardType) {
		return this.getColumnCount(cardType) === 3;
	}

	static gotOneColumn (cardType) {
		return this.getColumnCount(cardType) === 1;
	}


	static gotAlternativeHintStyle (cardType) {
		return cardTypesWithAlternativeHintStyle.includes(cardType);
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

	static gotSidesSwapped (cardType) {
		return cardTypesWithSwappedSides.includes(cardType);
	}

	static defaultCenteredText (cardType) {
		if (cardTypesWithCenteredText.includes(cardType)) {
			Session.set('centerTextElement', [true, true, false, false]);
		} else {
			Session.set('centerTextElement', [false, false, false, false]);
		}
	}

	static getHintTitle (cardType = -1) {
		let activeCardType = cardType;
		if (activeCardType === -1) {
			activeCardType = Session.get('cardType');
		}
		return TAPi18n.__('card.cardType' + activeCardType + '.hint');
	}

	static getFrontTitle (cardType = -1) {
		let activeCardType = cardType;
		if (activeCardType === -1) {
			activeCardType = Session.get('cardType');
		}
		return TAPi18n.__('card.cardType' + activeCardType + '.front');
	}

	static getBackTitle (cardType = -1) {
		let activeCardType = cardType;
		if (activeCardType === -1) {
			activeCardType = Session.get('cardType');
		}
		return TAPi18n.__('card.cardType' + activeCardType + '.back');
	}

	static getSubjectPlaceholderText (cardType = -1) {
		return TAPi18n.__('card.cardType' + cardType + '.placeholders.subject');
	}

	static getPlaceholderText (activeMode = -1, cardType = -1, learningGoalLevel = -1) {
		let side;
		if (activeMode < 0) {
			activeMode = Session.get('activeEditMode');
		}
		if (cardType < 0) {
			cardType = Session.get('cardType');
		}
		if (activeMode === 0 && this.gotLearningGoal(cardType)) {
			return TAPi18n.__('learning-goal.level' + (++learningGoalLevel) + 'Placeholder');
		}
		switch (activeMode) {
			case 0:
				side = 'front';
				break;
			case 1:
				side = 'back';
				break;
			case 2:
				side = 'hint';
				break;
			case 3:
				side = 'lecture';
				break;
		}
		return TAPi18n.__('card.cardType' + cardType + '.placeholders.' + side);
	}

	static getCardTypeName (cardType) {
		return TAPi18n.__('card.cardType' + cardType + '.name');
	}
}

module.exports = CardType;
