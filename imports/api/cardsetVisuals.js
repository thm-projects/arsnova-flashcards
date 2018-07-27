export let CardsetVisuals = class CardsetVisuals {
	static resizeCardsetInfo () {
		if ($(window).width() < 768) {
			$('.markdeepCardsetContent').css('max-height', 350);
		} else {
			$('.markdeepCardsetContent').css('max-height', 'unset');
			$('.markdeepCardsetContent').css('height', 'auto');
		}
	}
};
