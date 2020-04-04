import {NavigatorCheck} from "./navigatorCheck";
import * as config from "../config/pdfViewer";

export let fullscreenModal = class fullscreenModal {
	static getDeviceMaxSize() {
		if (NavigatorCheck.isSmartphone()) {
			if (NavigatorCheck.isLandscape()) {
				return config.smartphoneSize.landscape;
			} else {
				return config.smartphoneSize.portrait;
			}
		} else if (NavigatorCheck.isTablet()) {
			if (NavigatorCheck.isLandscape()) {
				return config.tabletSize.landscape;
			} else {
				return config.tabletSize.portrait;
			}
		} else {
			return config.desktopSize;
		}
	}

	static getIframeHeight() {
		return window.innerHeight * this.getDeviceMaxSize().height;
	}

	static getIframeWidth() {
		return window.innerWidth * this.getDeviceMaxSize().width;
	}

	static resizeIframe(modalName) {
		let fullscreenModal = $("#" + modalName);
		if (fullscreenModal.length) {
			fullscreenModal.height(this.getIframeHeight() + "px");
			fullscreenModal.width(this.getIframeWidth() + "px");
		}
	}
};
