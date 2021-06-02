import "./bonusWorkingTimeSum.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeSum
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeSum.helpers({
	getBonusWorkingTimeSum: function () {
		let bonusWorkingTimeSum = 0;
		if (this.performanceStats !== undefined && this.performanceStats.workingTime !== undefined) {
			bonusWorkingTimeSum = this.performanceStats.workingTime.sum;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeSum, true);
	}
});
