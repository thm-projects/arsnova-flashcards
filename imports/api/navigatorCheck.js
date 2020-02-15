import MobileDetect from "mobile-detect";
import * as config from "../config/navigator.js";

let md;

export let NavigatorCheck = class NavigatorCheck {

	static updateUserAgent () {
		md = new MobileDetect(window.navigator.userAgent);
	}

	static isSmartphone () {
		this.updateUserAgent();
		if (window.screen.width < config.minimumTabletWidth && window.screen.height < config.minimumTabletHeight) {
			return true;
		}
		return md.phone() != null;
	}

	static isTablet () {
		this.updateUserAgent();
		if (window.screen.width >= config.minimumTabletWidth && window.screen.height >= config.minimumTabletHeight && window.screen.width < config.maximumTabletWidth && window.screen.height < config.maximumTabletHeight) {
			return true;
		}
		return md.tablet() != null;
	}

	static isIOS () {
		this.updateUserAgent();
		return md.match(config.iOSPlatforms) || this.isTablet(); //we need an Android tablet to check for feature compliance
	}

	static isMacOS () {
		this.updateUserAgent();
		return md.match(config.macOSPlatforms);
	}

	static isSafari () {
		this.updateUserAgent();
		return md.version("BlackBerry"); //don't ask why this is the distinguishing criterion for a Safari
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
