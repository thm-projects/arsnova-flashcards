let minimumTabletWidth = 768;
let minimumTabletHeight = 1024;

// Enabled features for IOS devices
//0: Minute jump clock
//1: WordCloud - Landing Page
//2: WordCloud - Filter

let enabledIOSFeatures = [2];

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

	static isEdge () {
		return navigator.userAgent.indexOf("Edge") >= 0;
	}

	static isLandscape () {
		return window.innerWidth > window.innerHeight;
	}

	static gotFeatureSupport (feature) {
		if (this.isIOS()) {
			return enabledIOSFeatures.includes(feature);
		} else {
			return true;
		}
	}
};
