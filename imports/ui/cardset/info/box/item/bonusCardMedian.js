import "./bonusCardMedian.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusButton
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusCardMedian.helpers({
	getBonusCardMedian: function () {
		let bonusCardMedian = 0;
		if (this.performanceStats !== undefined && this.performanceStats.answerTime !== undefined) {
			bonusCardMedian = this.performanceStats.answerTime.median;
		}
		return Utilities.humanizeDuration(bonusCardMedian);
	}
});
