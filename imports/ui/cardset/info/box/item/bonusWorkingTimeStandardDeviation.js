import "./bonusWorkingTimeStandardDeviation.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeStandardDeviation
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeStandardDeviation.helpers({
	getBonusWorkingTimeStandardDeviation: function () {
		let bonusWorkingTimeStandardDeviation = 0;
		if (this.performanceStats !== undefined && this.performanceStats.workingTime !== undefined) {
			bonusWorkingTimeStandardDeviation = this.performanceStats.workingTime.standardDeviation.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeStandardDeviation);
	}
});
