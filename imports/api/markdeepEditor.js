import {Session} from "meteor/session";
import {toggleFullscreen} from "../ui/card/card";

class MarkdeepEditor {
	help () {
		window.open("https://casual-effects.com/markdeep/features.md.html", "_blank");
	}

	center () {
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

	orderCards () {
		$("#underDevelopmentModal").modal("show");
	}

	lockCardSide () {
		$("#underDevelopmentModal").modal("show");
	}

	changeBackgroundStyle () {
		if (Session.get('backgroundStyle') === 1) {
			Session.set('backgroundStyle', 0);
		} else {
			Session.set('backgroundStyle', 1);
		}
	}

	toggleFullscreen () {
		toggleFullscreen(false, true);
	}
}

module.exports = MarkdeepEditor;
