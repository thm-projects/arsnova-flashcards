import {CardType} from "../../../../api/cardTypes";
import {isNewCardset} from "../../../../ui/forms/cardsetForm";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";
import {Route} from "../../../../api/route";

Template.registerHelper("getCardsetBackground", function (difficulty, cardType) {
	if (cardType === -1) {
		return 'box-difficultyBlank0';
	}
	let cubeSides = CardType.getCardTypeCubeSides(cardType);
	if (cubeSides[0].defaultStyle !== "default") {
		return "box-" + cubeSides[0].defaultStyle;
	}
	if (!CardType.gotDifficultyLevel(cardType)) {
		return 'box-difficultyBlank0';
	}
	switch (difficulty) {
		case 0:
			if (CardType.gotNotesForDifficultyLevel(cardType)) {
				return 'box-difficultyBlankNote0';
			} else {
				return 'box-difficultyBlank0';
			}
			break;
		case 1:
			return 'box-difficultyBlank1';
		case 2:
			return 'box-difficultyBlank2';
		case 3:
			return 'box-difficultyBlank3';
		default:
			return 'box-difficultyBlank0';
	}
});

Template.registerHelper('isRepetitorium', function () {
	if (isNewCardset()) {
		if (ServerStyle.gotSimplifiedNav()) {
			return Session.get('useRepForm');
		} else {
			return Route.isRepetitorienFilterIndex();
		}
	} else {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').shuffled;
		}
	}
});
