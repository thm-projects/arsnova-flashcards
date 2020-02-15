import {NavigatorCheck} from "../api/navigatorCheck.js";
import * as config from "../config/pdfViewer.js";

export let PDFViewer = class PDFViewer {
	static getDeviceMaxSize () {
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

	static getIframeHeight () {
		return window.innerHeight * this.getDeviceMaxSize().height;
	}

	static getIframeWidth () {
		return window.innerWidth * this.getDeviceMaxSize().width;
	}

	static closeModal () {
		$('#pdfViewerModal').modal('hide');
	}

	static resizeIframe () {
		let pdfModal = $("#pdfViewer");
		if (pdfModal.length) {
			pdfModal.height(this.getIframeHeight() + "px");
			pdfModal.width(this.getIframeWidth() + "px");
		}
	}
};
