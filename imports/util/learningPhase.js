import {LeitnerLearningPhase} from "../api/subscriptions/leitner/leitnerLearningPhase";
import {LeitnerLearningWorkloadUtilities} from "./learningWorkload";
import {Route} from "./route";
import {Session} from "meteor/session";

export let LeitnerLearningPhaseUtilities = class LeitnerLearningPhaseUtilities {
	static getActiveLearningPhase (cardset_id, user_id, learning_phase_id = undefined) {
		if (learning_phase_id !== undefined) {
			return LeitnerLearningPhase.findOne({_id: learning_phase_id});
		} else {
			return LeitnerLearningPhase.findOne({_id: LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, user_id).learning_phase_id});
		}
	}

	static getActiveBonus (cardset_id) {
		let query = {cardset_id: cardset_id, isBonus: true};

		//Return selected learning phase if viewing the bonus Stats
		if (Meteor.isClient && Route.isCardsetLeitnerStats()) {
			query._id = Session.get('selectedLearningPhaseID');
		} else {
			query.isActive = true;
		}
		return LeitnerLearningPhase.findOne(query);
	}

	static getNewestBonus (cardset_id) {
		return LeitnerLearningPhase.findOne({cardset_id: cardset_id, isBonus: true}, {sort: {createdAt: -1}});
	}

	static isBonusActive (cardset_id, learningPhase = undefined) {
		let learningPhaseObject;
		if (learningPhase !== undefined) {
			learningPhaseObject = learningPhase;
		} else {
			learningPhaseObject = this.getActiveBonus(cardset_id);
		}
		if (learningPhaseObject !== undefined) {
			return learningPhaseObject.isActive;
		}
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

	/**
	 * Returns the bonus status that can be used for the card set
	 * 1 - Active bonus (planned)
	 * 2 - Active bonus (ongoing + registration period open)
	 * 3 - Active bonus (ongoing + registration period closed)
	 * 4 - Active bonus (finished)
	 * 5 - Archived bonus
	 * @param learningPhase - The bonus learning phase of the card set
	 */
	static setLeitnerBonusStatus (learningPhase) {
		if (learningPhase.isActive) {
			if (learningPhase.start < new Date()) {
				if (learningPhase.end > new Date()) {
					if (learningPhase.registrationPeriod > new Date()) {
						return 2;
					} else {
						return 3;
					}
				}
				return 4;
			}
			return 1;
		}
		return 5;
	}

	/**
	 * Converts the status of a cardsets bonus phase to the leitner 2.0 Format
	 * 0 - No active or archived bonus
	 * 1 - Active bonus (planned)
	 * 2 - Active bonus (ongoing + registration period open)
	 * 3 - Active bonus (ongoing + registration period closed)
	 * 4 - Active bonus (finished)
	 * @param cardset - The card set with the leitner 1.0 learning phase data
	 */
	static convertOldLeitnerBonusStatus (cardset) {
		if (cardset.learningActive) {
			if (cardset.learningStart < new Date()) {
				if (cardset.learningEnd > new Date()) {
					if (cardset.registrationPeriod > new Date()) {
						return 2;
					} else {
						return 3;
					}
				}
				return 4;
			}
			return 1;
		}
		return 0;
	}
};
