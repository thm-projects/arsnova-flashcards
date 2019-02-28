//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusActiveLearners.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusActiveLearners
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusActiveLearners.helpers({
	getActiveBonusLearnerCount: function (cardset) {
		if (cardset.workload !== undefined && cardset.workload.bonus !== undefined) {
			return cardset.workload.bonus.count;
		} else {
			return 0;
		}
	}
});
