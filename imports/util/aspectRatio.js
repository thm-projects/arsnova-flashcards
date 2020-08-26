import * as config from "../config/aspectRatio.js";
import {Route} from "./route";
import {MarkdeepEditor} from "./markdeepEditor";
import {NavigatorCheck} from "./navigatorCheck";
import {Fullscreen} from "./fullscreen";

export let AspectRatio = class AspectRatio {

	static isEnabled () {
		let canDisplayItem = true;
		if (Route.isEditMode() && !Fullscreen.isActive()) {
			canDisplayItem = false;
		}
		if ((canDisplayItem && !MarkdeepEditor.getMobilePreview()) || (Route.isDemo() || Route.isMakingOf())) {
			if ((Route.isPresentation() || Route.isPresentationTranscript()) && config.aspectRatioEnabled.includes(0)) {
				return true;
			}
			if ((Route.isDemo() || Route.isMakingOf()) && config.aspectRatioEnabled.includes(1)) {
				return true;
			}
			if (Route.isBox() && config.aspectRatioEnabled.includes(2)) {
				return true;
			}
			if (Route.isMemo() && config.aspectRatioEnabled.includes(3)) {
				return true;
			}
			if (Route.isEditMode() && config.aspectRatioEnabled.includes(4)) {
				return true;
			}
		}
	}

	static scaleCardNavigationWidth () {
		if ((Route.isPresentation() || Route.isPresentationTranscript()) && config.scaleCardNavigationWidth.includes(0)) {
			return true;
		}
		if ((Route.isDemo() || Route.isMakingOf()) && config.scaleCardNavigationWidth.includes(1)) {
			return true;
		}
		if (Route.isBox() && config.scaleCardNavigationWidth.includes(2)) {
			return true;
		}
		if (Route.isMemo() && config.scaleCardNavigationWidth.includes(3)) {
			return true;
		}
		if (Route.isEditMode() && config.scaleCardNavigationWidth.includes(4)) {
			return true;
		}
	}

	static scale3DCardNavigationWidth () {
		if ((Route.isPresentation() || Route.isPresentationTranscript()) && config.scale3DCardNavigationWidth.includes(0)) {
			return true;
		}
		if ((Route.isDemo() || Route.isMakingOf()) && config.scale3DCardNavigationWidth.includes(1)) {
			return true;
		}
		if (Route.isBox() && config.scale3DCardNavigationWidth.includes(2)) {
			return true;
		}
		if (Route.isMemo() && config.scale3DCardNavigationWidth.includes(3)) {
			return true;
		}
		if (Route.isEditMode() && config.scale3DCardNavigationWidth.includes(4)) {
			return true;
		}
	}

	static getDefault () {
		if (Route.isPresentation() || Route.isPresentationTranscript() || Route.isCardset()) {
			if (NavigatorCheck.isIOS()) {
				return config.defaultAspectRatioTablet[0];
			} else {
				return config.defaultAspectRatio[0];
			}
		}
		if ((Route.isDemo() || Route.isMakingOf())) {
			if (NavigatorCheck.isIOS()) {
				return config.defaultAspectRatioTablet[1];
			} else {
				return config.defaultAspectRatio[1];
			}
		}
		if (Route.isBox()) {
			if (NavigatorCheck.isIOS()) {
				return config.defaultAspectRatioTablet[2];
			} else {
				return config.defaultAspectRatio[2];
			}
		}
		if (Route.isMemo()) {
			if (NavigatorCheck.isIOS()) {
				return config.defaultAspectRatioTablet[3];
			} else {
				return config.defaultAspectRatio[3];
			}
		}
		if (Route.isEditMode()) {
			if (NavigatorCheck.isIOS()) {
				return config.defaultAspectRatioTablet[4];
			} else {
				return config.defaultAspectRatio[4];
			}
		}
	}

	static getAspectRatios () {
		return config.aspectRatios;
	}
};
