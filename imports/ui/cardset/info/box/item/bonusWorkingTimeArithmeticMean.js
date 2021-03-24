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
			bonusWorkingTimeArithmeticMean = this.performanceStats.workingTime.arithmeticMean.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeArithmeticMean);
	}
});
