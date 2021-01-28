import "./bonusWorkingTimeArithmeticMean.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkingTimeArithmeticMean
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkingTimeArithmeticMean.helpers({
	getBonusWorkingTimeArithmeticMean: function () {
		let bonusWorkingTimeArithmeticMean = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.workingTime !== undefined) {
			bonusWorkingTimeArithmeticMean = Session.get('activeCardset').learningStatistics.workingTime.arithmeticMean.bonus;
		}
		return Utilities.humanizeDuration(bonusWorkingTimeArithmeticMean);
	}
});
