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
		if (Session.get('activeCardset').bonus !== undefined && Session.get('activeCardset').bonus.timelineStats !== undefined) {
			bonusCardMedian = Session.get('activeCardset').bonus.timelineStats.median;
		}
		return Utilities.humanizeDuration(bonusCardMedian);
	}
});
