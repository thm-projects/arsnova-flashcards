import "./bonusWorkingTimeSum.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeSum
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeSum.helpers({
	getBonusWorkingTimeSum: function () {
		let bonusWorkingTimeSum = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.workingTime !== undefined) {
			bonusWorkingTimeSum = Session.get('activeCardset').learningStatistics.workingTime.sum.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeSum, true);
	}
});
