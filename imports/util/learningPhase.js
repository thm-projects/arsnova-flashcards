import {LeitnerLearningPhase} from "../api/subscriptions/leitner/leitnerLearningPhase";

export let LeitnerLearningPhaseUtilities = class LeitnerLearningPhaseUtilities {
	static getActiveBonus (cardset_id) {
		return LeitnerLearningPhase.findOne({cardset_id: cardset_id, isBonus: true, isActive: true});
	}

	static getNewestBonus (cardset_id) {
		return LeitnerLearningPhase.findOne({cardset_id: cardset_id, isBonus: true}, {$sort: {createdAt: -1}});
	}

	static isBonusActive (cardset_id, learningPhase = undefined) {
		let learningPhaseObject;
		if (learningPhase !== undefined) {
			learningPhaseObject = learningPhase;
		} else {
			learningPhaseObject = this.getActiveBonus(cardset_id);
		}
		return learningPhaseObject.isActive;
	}

	static getMaxBonusPoints (cardset_id, learningPhase = undefined) {
		let learningPhaseObject;
		if (learningPhase !== undefined) {
			learningPhaseObject = learningPhase;
		} else {
			learningPhaseObject = this.getActiveBonus(cardset_id);
		}
		return learningPhaseObject.bonusPoints.maxPoints;
	}

	static getLearningPhase (learning_phase_id) {
		return LeitnerLearningPhase.findOne({_id: learning_phase_id});
	}
};
