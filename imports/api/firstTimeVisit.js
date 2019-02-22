import * as conf from "../config/firstTimeVisit.js";

export let FirstTimeVisit = class FirstTimeVisit {

	static isFirstTimeVisitModalEnabled () {
		return conf.enableFirstTimeVisitModal;
	}

	static redirectToHomeAfterFullscreenExit () {
		return conf.redirectToHomeAfterExit;
	}
};
