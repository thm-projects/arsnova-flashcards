let minimumTabletWidth = 768;
let minimumTabletHeight = 1024;

export let NavigatorCheck = class CardVisuals {

	static isSmartphone () {
		return (window.screen.width < minimumTabletWidth && window.screen.height < minimumTabletHeight);
	}

	static isIOS () {
		return ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
	}

	static isSafari () {
		return navigator.userAgent.indexOf("Safari") >= 0 && navigator.userAgent.indexOf("Chrome") === -1;
	}
};
