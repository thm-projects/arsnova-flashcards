import {NavigatorCheck} from "./navigatorCheck";

export let CardsetVisuals = class CardsetVisuals {
	static resizeCardsetInfo () {
		if (NavigatorCheck.isSmartphone()) {
			$('.markdeepCardsetContent').css('max-height', 350);
		} else {
			$('.markdeepCardsetContent').css('max-height', 'unset');
			$('.markdeepCardsetContent').css('height', 'auto');
		}
	}

	static changeCollapseElement (elementId) {
		let iconId = elementId + "Icon";
		if ($(iconId).hasClass("fa-caret-square-down")) {
			$(iconId).removeClass("fa-caret-square-down");
			$(iconId).addClass("fa-caret-square-up");
			$(elementId).slideDown();
		} else {
			$(iconId).removeClass("fa-caret-square-up");
			$(iconId).addClass("fa-caret-square-down");
			$(elementId).slideUp();
		}
	}
};
