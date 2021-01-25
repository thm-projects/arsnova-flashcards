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
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').leitner !== undefined && Session.get('activeCardset').leitner.timelineStats !== undefined) {
			bonusCardMedian = Session.get('activeCardset').leitner.timelineStats.median.bonus;
		}
		return Utilities.humanizeDuration(bonusCardMedian);
	}
});
