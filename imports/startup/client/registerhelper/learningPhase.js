import {LeitnerLearningPhaseUtilities} from "../../../util/learningPhase";
import {Route} from "../../../util/route";
import {LeitnerLearningPhase} from "../../../api/subscriptions/leitner/leitnerLearningPhase";
import {Session} from "meteor/session";

Template.registerHelper("getActiveBonusLearningPhase", function (cardset_id) {
	if (Route.isCardsetLeitnerStats()) {
		return LeitnerLearningPhase.findOne({_id: Session.get('selectedLearningPhaseID')});
	} else {
		return LeitnerLearningPhaseUtilities.getActiveBonus(cardset_id);
	}
});

Template.registerHelper("isBonusActive", function (cardset_id, learningPhase = undefined) {
	return LeitnerLearningPhaseUtilities.isBonusActive(cardset_id, learningPhase);
});
