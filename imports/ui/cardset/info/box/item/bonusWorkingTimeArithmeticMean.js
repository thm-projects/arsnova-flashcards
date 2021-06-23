import "./bonusWorkingTimeArithmeticMean.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeArithmeticMean
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeArithmeticMean.helpers({
	getBonusWorkingTimeArithmeticMean: function () {
		let bonusWorkingTimeArithmeticMean = 0;
		if (this.performanceStats !== undefined && this.performanceStats.workingTime !== undefined) {
			bonusWorkingTimeArithmeticMean = this.performanceStats.workingTime.arithmeticMean;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeArithmeticMean);
	}
});
