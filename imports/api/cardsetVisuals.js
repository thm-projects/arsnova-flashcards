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
		if ($(iconId).hasClass("glyphicon-collapse-down")) {
			$(iconId).removeClass("glyphicon-collapse-down");
			$(iconId).addClass("glyphicon-collapse-up");
			$(elementId).slideDown();
		} else {
			$(iconId).removeClass("glyphicon-collapse-up");
			$(iconId).addClass("glyphicon-collapse-down");
			$(elementId).slideUp();
		}
	}
};
