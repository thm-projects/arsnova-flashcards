//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import "./bonusActiveLearners.html";
import {Session} from "meteor/session";

/*
* ############################################################################
* cardsetInfoBoxItemBonusActiveLearners
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusActiveLearners.helpers({
	getActiveBonusLearnerCount: function (learningPhase) {
		if (learningPhase.isActive) {
			let cardset = Cardsets.findOne({_id: learningPhase.cardset_id});
			if (cardset !== undefined && cardset.learnerCount !== undefined) {
				return cardset.learnerCount.bonus;
			} else {
				return 0;
			}
		} else {
			return Session.get("selectedLearningStatistics").length;
		}
	}
});
