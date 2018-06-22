import {Session} from "meteor/session";
import {CardVisuals} from "./cardVisuals.js";

export let MarkdeepEditor = class MarkdeepEditor {
	static help () {
		window.open("https://arsnova.cards/cardset/nqA6A8CyYNbEceyw9", "_blank");
	}

	static center () {
		let centerTextElement = Session.get('centerTextElement');
		let contentId = Session.get('activeCardContentId');
		--contentId;
		if (centerTextElement[contentId]) {
			centerTextElement[contentId] = false;
			Session.set('centerTextElement', centerTextElement);
		} else {
			centerTextElement[contentId] = true;
			Session.set('centerTextElement', centerTextElement);
		}
	}

	static changeBackgroundStyle () {
		if (Session.get('backgroundStyle') === 1) {
			Session.set('backgroundStyle', 0);
		} else {
			Session.set('backgroundStyle', 1);
		}
	}

	static displayDictionary () {
		if (Session.get('dictionaryPreview') === 0) {
			Session.set('dictionaryPreview', 1);
		} else {
			Session.set('dictionaryPreview', 0);
		}
		$('#contentEditor').focus();
	}

	static toggleFullscreen () {
		CardVisuals.toggleFullscreen(false, true);
	}
};
