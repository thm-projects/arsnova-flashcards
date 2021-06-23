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
		if (cardset !== undefined && cardset.learnerCount !== undefined) {
			return cardset.learnerCount.bonus + cardset.learnerCount.normal;
		} else {
			return 0;
		}
	}
});
