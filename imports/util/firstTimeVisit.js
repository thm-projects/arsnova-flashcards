import * as conf from "../config/firstTimeVisit.js";

export let FirstTimeVisit = class FirstTimeVisit {

	static redirectToHomeAfterFullscreenExit () {
		return conf.redirectToHomeAfterExit;
	}

	static isFirstTimePresentationModalEnabled () {
		return conf.enableFirstTimePresentationModal;
	}

	static isFirstTimeVisitDemoEnabled () {
		return conf.enableFirstTimeVisitDemo;
	}
};
