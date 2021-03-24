import "./bonusWorkingTimeMedian.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeMedian
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeMedian.helpers({
	getBonusWorkingTimeMedian: function () {
		let bonusWorkingTimeMedian = 0;
		if (this.performanceStats !== undefined && this.performanceStats.workingTime !== undefined) {
			bonusWorkingTimeMedian = this.performanceStats.workingTime.median.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeMedian);
	}
});
