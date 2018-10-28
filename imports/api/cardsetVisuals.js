export let CardsetVisuals = class CardsetVisuals {
	static resizeCardsetInfo () {
		if ($(window).width() < 768) {
			$('.markdeepCardsetContent').css('max-height', 350);
		} else {
			$('.markdeepCardsetContent').css('max-height', 'unset');
			$('.markdeepCardsetContent').css('height', 'auto');
		}
	}

	static changeCollapseIcon (iconId) {
		if ($(iconId).hasClass("glyphicon-collapse-down")) {
			$(iconId).removeClass("glyphicon-collapse-down");
			$(iconId).addClass("glyphicon-collapse-up");
		} else {
			$(iconId).removeClass("glyphicon-collapse-up");
			$(iconId).addClass("glyphicon-collapse-down");
		}
	}
};
