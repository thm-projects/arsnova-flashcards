import {LeitnerLearningPhaseUtilities} from "../../../util/learningPhase";
import {Route} from "../../../util/route";
import {LeitnerLearningPhase} from "../../../api/subscriptions/leitner/leitnerLearningPhase";
import {Session} from "meteor/session";

Template.registerHelper("getActiveBonusLearningPhase", function (cardset_id, isBonusForm = false) {
	if (Route.isCardsetLeitnerStats()) {
		return LeitnerLearningPhase.findOne({_id: Session.get('selectedLearningPhaseID')});
	} else if (Route.isCardsetDetails()) {
		if (isBonusForm) {
			//Dummy object for new bonus form modal
			return {isActive: true};
		} else {
			return LeitnerLearningPhase.findOne({cardset_id: cardset_id, isActive: true});
		}
	} else {
		return LeitnerLearningPhaseUtilities.getActiveBonus(cardset_id);
	}
});

Template.registerHelper("isBonusActive", function (cardset_id, learningPhase = undefined) {
	return LeitnerLearningPhaseUtilities.isBonusActive(cardset_id, learningPhase);
});
