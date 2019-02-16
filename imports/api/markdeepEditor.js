import {Session} from "meteor/session";
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/markdeepEditor.js";

export let MarkdeepEditor = class MarkdeepEditor {
	static help () {
		window.open(config.markdeepHelpLink, "_blank");
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

	static leftAlign () {
		let alignType = Session.get('alignType');
		let contentId = Session.get('activeCardContentId');
		--contentId;
		if (alignType[contentId] === 1) {
			alignType[contentId] = 0;
			Session.set('alignType', alignType);
		} else {
			alignType[contentId] = 1;
			Session.set('alignType', alignType);
		}
	}

	static changeMobilePreview (forceOff = false) {
		if (Session.get('mobilePreview') === 1 || forceOff) {
			Session.set('mobilePreview', 0);
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
		if (Session.get('backgroundStyle') == 1) {
			Session.set('backgroundStyle', 0);
		} else {
			Session.set('backgroundStyle', 1);
		}
	}

	static toggleFullscreen () {
		CardVisuals.toggleFullscreen(false, true);
	}

	static getDefaultMobilePreviewOrientation () {
		return config.mobilePreviewPortraitAsDefault;
	}
};
