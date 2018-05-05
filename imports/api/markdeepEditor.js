import {Session} from "meteor/session";
import {toggleFullscreen} from "../ui/card/card";

class MarkdeepEditor {
	static help () {
		window.open("https://casual-effects.com/markdeep/features.md.html", "_blank");
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

	static orderCards () {
		$("#underDevelopmentModal").modal("show");
	}

	static lockCardSide () {
		$("#underDevelopmentModal").modal("show");
	}

	static changeBackgroundStyle () {
		if (Session.get('backgroundStyle') === 1) {
			Session.set('backgroundStyle', 0);
		} else {
			Session.set('backgroundStyle', 1);
		}
	}

	static toggleFullscreen () {
		toggleFullscreen(false, true);
	}
}

module.exports = MarkdeepEditor;
