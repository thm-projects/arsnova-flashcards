import "./bonusCardStandardDeviation.html";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusCardStandardDeviation
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusCardStandardDeviation.helpers({
	getBonusCardStandardDeviation: function () {
		let bonusCardStandardDeviation = 0;
		if (this.performanceStats !== undefined && this.performanceStats.answerTime !== undefined) {
			bonusCardStandardDeviation = this.performanceStats.answerTime.standardDeviation.bonus;
		}
		return Utilities.humanizeDuration(bonusCardStandardDeviation);
	}
});
