import "./bonusCardMedian.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusButton
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusCardMedian.helpers({
	getBonusCardMedian: function () {
		let bonusCardMedian = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.answerTime !== undefined) {
			bonusCardMedian = Session.get('activeCardset').learningStatistics.answerTime.median.bonus;
		}
		return Utilities.humanizeDuration(bonusCardMedian);
	}
});
