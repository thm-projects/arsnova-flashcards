import "./bonusWorkingTimeStandardDeviation.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeStandardDeviation
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeStandardDeviation.helpers({
	getBonusWorkingTimeStandardDeviation: function () {
		let bonusWorkingTimeStandardDeviation = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.workingTime !== undefined) {
			bonusWorkingTimeStandardDeviation = Session.get('activeCardset').learningStatistics.workingTime.standardDeviation.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeStandardDeviation);
	}
});
