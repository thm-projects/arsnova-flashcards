import "./bonusCardArithmeticMean.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusCardArithmeticMean
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusCardArithmeticMean.helpers({
	getBonusCardArithmeticMean: function () {
		let bonusCardArithmeticMean = 0;
		if (this.performanceStats !== undefined && this.performanceStats.answerTime !== undefined) {
			bonusCardArithmeticMean = this.performanceStats.answerTime.arithmeticMean;
		}
		return Utilities.humanizeDuration(bonusCardArithmeticMean);
	}
});
