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
		if (this.workload.bonus.minLearned !== undefined) {
			return this.workload.bonus.minLearned;
		} else {
			return 0;
		}
	}
});
