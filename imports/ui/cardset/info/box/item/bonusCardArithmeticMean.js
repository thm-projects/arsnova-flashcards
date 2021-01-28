import "./bonusCardArithmeticMean.html";
import {Session} from "meteor/session";
import {Utilities} from "../../../../../util/utilities";
/*
* ############################################################################
* cardsetInfoBoxItemBonusCardArithmeticMean
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusCardArithmeticMean.helpers({
	getBonusCardArithmeticMean: function () {
		let bonusCardArithmeticMean = 0;
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').learningStatistics !== undefined && Session.get('activeCardset').learningStatistics.answerTime !== undefined) {
			bonusCardArithmeticMean = Session.get('activeCardset').learningStatistics.answerTime.arithmeticMean.bonus;
		}
		return Utilities.humanizeDuration(bonusCardArithmeticMean);
	}
});
