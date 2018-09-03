import {Session} from "meteor/session";
import {CardVisuals} from "./cardVisuals.js";

export let MarkdeepEditor = class MarkdeepEditor {
	static help () {
		window.open("https://casual-effects.com/markdeep/features.md.html", "_blank");
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

	static changeMobilePreview (forceOff = false) {
		if (Session.get('mobilePreview') === 1 || forceOff) {
			Session.set('mobilePreview', 0);
			Session.set('mobilePreviewRotated', 0);
		} else {
			Session.set('mobilePreview', 1);
		}
	}

	static changeMobilePreviewRotation () {
		if (Session.get('mobilePreviewRotated')) {
			Session.set('mobilePreviewRotated', 0);
		} else {
			Session.set('mobilePreviewRotated', 1);
		}
	}

	static getMobilePreview () {
		return Session.get('mobilePreview');
	}

	static changeBackgroundStyle () {
		if (Session.get('backgroundStyle') === 1) {
			Session.set('backgroundStyle', 0);
		} else {
			Session.set('backgroundStyle', 1);
		}
	}

	static displayBeolingusDictionary() {
		if (Session.get('dictionaryBeolingus') === 0) {
			Session.set('dictionaryLinguee', 0);
			Session.set('dictionaryGoogle', 0);
			Session.set('dictionaryBeolingus', 1);
		} else {
			Session.set('dictionaryBeolingus', 0);
		}
		$('#contentEditor').focus();
	}

	static displayLingueeDictionary() {
		if (Session.get('dictionaryLinguee') === 0) {
			Session.set('dictionaryBeolingus', 0);
			Session.set('dictionaryGoogle', 0);
			Session.set('dictionaryLinguee', 1);
		} else {
			Session.set('dictionaryLinguee', 0);
		}
		$('#contentEditor').focus();
	}

	static displayGoogleDictionary() {
		if (Session.get('dictionaryGoogle') === 0) {
			Session.set('dictionaryBeolingus', 0);
			Session.set('dictionaryLinguee', 0);
			Session.set('dictionaryGoogle', 1);
		} else {
			Session.set('dictionaryGoogle', 0);
		}
		$('#contentEditor').focus();
	}


	static toggleFullscreen() {
		CardVisuals.toggleFullscreen(false, true);
	}
};
