import * as global from "./global.js";


module.exports = {
	memoView: function () {
		browser.waitForVisible('#memoFlashcard', global.threshold);
	}
};
