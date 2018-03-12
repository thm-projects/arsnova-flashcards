import "./cardTypes.html";
import {Session} from "meteor/session";

let cardTypesWithCenteredText = [1, 2, 4];
let cardTypesWithDictionary = [1];
let cardTypesWithDifficultyLevel = [0, 1, 2, 5, 6, 7];
let cardTypesWithHint = [0, 2, 4, 5];
let cardTypesWithLearningGoal = [0, 5, 6, 7];
let cardTypesWithLearningUnit = [0, 2, 3, 5];
let cardTypeWithNotesForDifficultyLevel = [2];
let cardTypesWithLecture = [0];

export function gotHint(cardType) {
	return cardTypesWithHint.includes(cardType);
}

export function gotLecture(cardType) {
	return cardTypesWithLecture.includes(cardType);
}

function getColumnCount(cardType) {
	let i = 2;
	if (gotHint(cardType)) {
		i++;
	}
	if (gotLecture(cardType)) {
		i++;
	}
	return i;
}

export function gotFourColumns(cardType) {
	return getColumnCount(cardType) === 4;
}

export function gotThreeColumns(cardType) {
	return getColumnCount(cardType) === 3;
}

export function gotLearningUnit(cardType) {
	return cardTypesWithLearningUnit.includes(cardType);
}

export function gotLearningGoal(cardType) {
	return cardTypesWithLearningGoal.includes(cardType);
}

export function gotDifficultyLevel(cardType) {
	return cardTypesWithDifficultyLevel.includes(cardType);
}

export function gotNotesForDifficultyLevel(cardType) {
	return cardTypeWithNotesForDifficultyLevel.includes(cardType);
}

export function gotDictionary(cardType) {
	return cardTypesWithDictionary.includes(cardType);
}

export function defaultCenteredText(cardType) {
	if (cardTypesWithCenteredText.includes(cardType)) {
		Session.set('centerTextElement', [true, true, false, false]);
	} else {
		Session.set('centerTextElement', [false, false, false, false]);
	}
}

export function getHintTitle(cardType = -1) {
	let activeCardType = cardType;
	if (activeCardType === -1) {
		activeCardType = Session.get('cardType');
	}
	return TAPi18n.__('card.cardType' + activeCardType + '.hint');
}

export function getFrontTitle(cardType = -1) {
	let activeCardType = cardType;
	if (activeCardType === -1) {
		activeCardType = Session.get('cardType');
	}
	return TAPi18n.__('card.cardType' + activeCardType + '.front');
}

export function getBackTitle(cardType = -1) {
	let activeCardType = cardType;
	if (activeCardType === -1) {
		activeCardType = Session.get('cardType');
	}
	return TAPi18n.__('card.cardType' + activeCardType + '.back');
}

export function getPlaceholderText(activeMode = -1, cardType = -1) {
	let side;
	if (activeMode < 0) {
		activeMode = Session.get('activeEditMode');
	}
	if (cardType < 0) {
		cardType = Session.get('cardType');
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

export function getCardTypeName(cardType) {
	return TAPi18n.__('card.cardType' + cardType + '.name');
}
