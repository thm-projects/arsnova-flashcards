import {LeitnerLearningPhaseUtilities} from "../../../util/learningPhase";

Template.registerHelper("getActiveBonusLearningPhase", function (cardset_id) {
	return LeitnerLearningPhaseUtilities.getActiveBonus(cardset_id);
});

Template.registerHelper("isBonusActive", function (cardset_id, learningPhase = undefined) {
	return LeitnerLearningPhaseUtilities.isBonusActive(cardset_id, learningPhase);
});
