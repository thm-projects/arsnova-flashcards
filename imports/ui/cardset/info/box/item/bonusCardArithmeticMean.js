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
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').leitner !== undefined && Session.get('activeCardset').leitner.timelineStats !== undefined) {
			bonusCardArithmeticMean = Session.get('activeCardset').leitner.timelineStats.arithmeticMean.bonus;
		}
		return Utilities.humanizeDuration(bonusCardArithmeticMean);
	}
});
