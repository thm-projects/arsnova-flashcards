import {Session} from "meteor/session";
import {CardVisuals} from "./cardVisuals.js";

export let MarkdeepEditor = class MarkdeepEditor {
	static help () {
		window.open("https://arsnova.cards/cardset/nqA6A8CyYNbEceyw9", "_blank");
	}

	static center () {
		let centerTextElement = Session.get('centerTextElement');
		let editMode = Session.get('activeEditMode');
		if (centerTextElement[editMode]) {
			centerTextElement[editMode] = false;
			Session.set('centerTextElement', centerTextElement);
		} else {
			centerTextElement[editMode] = true;
			Session.set('centerTextElement', centerTextElement);
		}
	}

	static cardSideNavigation (forward = true) {
		let navigationLength = $(".editorNavigation a").length;
		let index = ($(".btn-primary").index(".editorNavigation a"));
		++index;
		if (forward) {
			if (index >= navigationLength) {
				index = 1;
			} else {
				++index;
			}
		} else {
			if (index <= 1) {
				index = navigationLength;
			} else {
				--index;
			}
		}
		$(".editorNavigation > li:nth-child(" + index + ") a").click();
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
