import "./bonusCardStandardDeviation.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusCardStandardDeviation
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusCardStandardDeviation.helpers({
	getBonusCardStandardDeviation: function () {
		let bonusCardStandardDeviation = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.answerTime !== undefined) {
			bonusCardStandardDeviation = Session.get('activeCardset').learningStatistics.answerTime.standardDeviation.bonus;
		}
		return Utilities.humanizeDuration(bonusCardStandardDeviation);
	}
});
