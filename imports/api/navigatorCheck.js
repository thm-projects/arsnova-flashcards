import * as config from "../config/navigator.js";

export let NavigatorCheck = class CardVisuals {

	static isSmartphone () {
		return (window.screen.width < config.minimumTabletWidth && window.screen.height < config.minimumTabletHeight);
	}

	static isIOS () {
		return ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
	}

	static isSafari () {
		return navigator.userAgent.indexOf("Safari") >= 0 && navigator.userAgent.indexOf("Chrome") === -1;
	}

	static isEdge () {
		return navigator.userAgent.indexOf("Edge") >= 0;
	}

	static isLandscape () {
		return window.innerWidth > window.innerHeight;
	}

	static gotFeatureSupport (feature) {
		if (this.isIOS()) {
			return config.enabledIOSFeatures.includes(feature);
		} else {
			return true;
		}
	}
};
