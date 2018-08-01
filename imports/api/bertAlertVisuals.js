export let BertAlertVisuals = class BertAlertVisuals {

	static displayBertAlert (message, type, style, title) {
		this.setBertAlertMargin();
		if (arguments.length === 4) {
			Bert.alert({
				title: title + ':',
				message: message,
				type: type,
				style: style
			});
		} else {
			Bert.alert(message, type, style);
		}
	}

	static setBertAlertMargin () {
		let mainContent = $('.row');
		let bertAlert = $('.bert-alert');
		let offsetTop = mainContent.offset().top + 10;
		let offsetLeft = 0;
		bertAlert.css('top', offsetTop);
		if ($(window).width() < 900) {
			offsetLeft = mainContent.offset().left;
		}
		bertAlert.css('margin-left', offsetLeft);
	}
};
