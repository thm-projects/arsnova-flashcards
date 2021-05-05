import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";
import {Cardsets} from "../../../../../../../api/subscriptions/cardsets";
import * as bonusConfig from "../../../../../../../config/bonusForm";
import {LeitnerLearningPhase} from "../../../../../../../api/subscriptions/leitner/leitnerLearningPhase";
import {LeitnerLearningPhaseUtilities} from "../../../../../../../util/learningPhase";

function leitnerLearningPhase() {
	let groupName = "leitnerLearningPhase Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);
	let itemName = "leitnerLearningPhase move from cardset";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let cardsets = Cardsets.find({learningActive: {$exists: true}}).fetch();
	if (cardsets.length) {
		cardsets.forEach((cardset) => {
			let learnerCount = {
				normal: 0,
				bonus: 0
			};
			let simulator = {};
			if (cardset.learningActive === true) {
				let minLearned = bonusConfig.defaultMinLearned;
				let maxPoints = bonusConfig.defaultMaxBonusPoints;
				if (cardset.workload !== undefined) {
					if (cardset.workload.bonus !== undefined) {
						minLearned = cardset.workload.bonus.minLearned;
						maxPoints = cardset.workload.bonus.maxPoints;
						learnerCount.bonus = cardset.workload.bonus.count;
					}
					if (cardset.workload.normal !== undefined) {
						learnerCount.normal = cardset.workload.normal.count;
					}
					if (cardset.simulator !== undefined) {
						simulator = {
							errorCount: cardset.simulator.errorCount
						};
					}
				}
				let newLearningPhaseObject = {
					cardset_id: cardset._id,
					isActive: true,
					isBonus: true,
					createdAt: cardset.learningStart,
					updatedAt: cardset.learningStart,
					daysBeforeReset: cardset.daysBeforeReset,
					start: cardset.learningStart,
					end: cardset.learningEnd,
					intervals: cardset.learningInterval,
					registrationPeriod: cardset.registrationPeriod,
					maxCards: cardset.maxCards,
					pomodoroTimer: cardset.pomodoroTimer,
					bonusPoints: {
						minLearned: minLearned,
						maxPoints: maxPoints
					},
					strictTimer: cardset.strictWorkloadTimer,
					forceNotifications: cardset.forceNotifications,
					performanceStats: cardset.learningStatistics,
					simulator: simulator
				};
				LeitnerLearningPhase.insert(newLearningPhaseObject);
			}
			Cardsets.update({
					_id: cardset._id
				},
				{
					$set: {
						learnerCount: learnerCount,
						bonusStatus: LeitnerLearningPhaseUtilities.convertOldLeitnerBonusStatus(cardset)
					},
					$unset: {
						learningActive: 1,
						leitner: 1,
						learningStart: 1,
						learningEnd: 1,
						daysBeforeReset: 1,
						learningInterval: 1,
						registrationPeriod: 1,
						maxCards: 1,
						pomodoroTimer: 1,
						workload: 1,
						strictWorkloadTimer: 1,
						forceNotifications: 1,
						learningStatistics: 1
					}
				});
		});
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}
	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerLearningPhase
};
