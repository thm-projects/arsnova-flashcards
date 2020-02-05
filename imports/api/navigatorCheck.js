import MobileDetect from "mobile-detect";
import * as config from "../config/navigator.js";

let md;

export let NavigatorCheck = class CardVisuals {

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
		//Return true if only one of the following tests detects iOS
		return md.match(config.iOSPlatforms) || md.os() === 'iOS' || md.versionStr('iOS') != null || this.isTablet();
	}

	static isMacOS () {
		this.updateUserAgent();
		return md.match(config.macOSPlatforms);
	}

	static isSafari () {
		this.updateUserAgent();
		return md.userAgent() === ("Safari");
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
