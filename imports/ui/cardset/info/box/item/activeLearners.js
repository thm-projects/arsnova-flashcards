//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./activeLearners.html";

/*
* ############################################################################
* cardsetInfoBoxItemActiveLearners
* ############################################################################
*/

Template.cardsetInfoBoxItemActiveLearners.helpers({
	getActiveLearnerCount: function (cardset) {
		if (cardset.workload !== undefined && cardset.workload.normal !== undefined) {
			return cardset.workload.normal.count;
		} else {
			return 0;
		}
	},
	getActiveBonusLearnerCount: function (cardset) {
		if (cardset.workload !== undefined && cardset.workload.bonus !== undefined) {
			return cardset.workload.bonus.count;
		} else {
			return 0;
		}
	}
});
