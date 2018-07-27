export let CardsetVisuals = class CardsetVisuals {
	static resizeCardsetInfo () {
		if ($(window).width() < 768) {
			let markdeepCardsetContent = $('.markdeepCardsetContent');
			let offsetTop = markdeepCardsetContent.offset().top;
			let marginBotom = $('.cardsetInfoFooter').height() + 10;
			markdeepCardsetContent.css('height', $(window).height() - offsetTop - marginBotom);
		} else {
			$('.markdeepCardsetContent').css('height', 'auto');
		}
	}
};
