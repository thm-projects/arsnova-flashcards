import "./bonusWorkingTimeMedian.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeMedian
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeMedian.helpers({
	getBonusWorkingTimeMedian: function () {
		let bonusWorkingTimeMedian = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.workingTime !== undefined) {
			bonusWorkingTimeMedian = Session.get('activeCardset').learningStatistics.workingTime.median.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeMedian);
	}
});
