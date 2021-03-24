//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import "./bonusActiveLearners.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusActiveLearners
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusActiveLearners.helpers({
	getActiveBonusLearnerCount: function (learningPhase) {
		let cardset = Cardsets.findOne({_id: learningPhase.cardset_id});
		if (cardset !== undefined && cardset.learnerCount !== undefined) {
			return cardset.learnerCount.bonus;
		} else {
			return 0;
		}
	}
});
