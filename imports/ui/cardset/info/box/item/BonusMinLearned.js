//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./BonusMinLearned.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusMinLearned
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusMinLearned.helpers({
	getMinLearned: function () {
		if (this.bonusPoints.minLearned !== undefined) {
			return this.bonusPoints.minLearned;
		} else {
			return 0;
		}
	}
});
