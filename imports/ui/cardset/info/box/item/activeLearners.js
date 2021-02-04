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
		if (cardset.workload !== undefined && cardset.workload.normal !== undefined && cardset.workload.bonus !== undefined) {
			return cardset.workload.normal.count + cardset.workload.bonus.count;
		} else {
			return 0;
		}
	}
});
