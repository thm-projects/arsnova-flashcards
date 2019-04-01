import * as config from "../config/navigator.js";

export let NavigatorCheck = class CardVisuals {

	static isSmartphone () {
		return (window.screen.width < config.minimumTabletWidth && window.screen.height < config.minimumTabletHeight);
	}

	static isTablet () {
		return (window.screen.width >= config.minimumTabletWidth && window.screen.height >= config.minimumTabletHeight && window.screen.width < config.maximumTabletWidth && window.screen.height < config.maximumTabletHeight);
	}

	static isIOS () {
		return config.iOSPlatforms.indexOf(navigator.platform) >= 0;
	}

	static isMacOS () {
		return config.macOSPlatforms.indexOf(navigator.platform) >= 0;
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

	static isMacOSSafari () {
		return this.isMacOS() && this.isSafari();
	}

	static gotFeatureSupport (feature) {
		if (this.isSmartphone()) {
			if (config.enabledSmartphoneFeatures.includes(feature)) {
				if (this.isIOS()) {
					return config.enabledIOSFeatures.includes(feature);
				} else {
					return true;
				}
			} else {
				return false;
			}
		} else if (this.isIOS()) {
			return config.enabledIOSFeatures.includes(feature);
		} else if (this.isMacOSSafari()) {
			return config.enabledMacOSSafariFeatures.includes(feature);
		} else {
			return true;
		}
	}
};
