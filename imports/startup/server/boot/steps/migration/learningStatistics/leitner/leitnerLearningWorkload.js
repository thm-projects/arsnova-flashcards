import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";
import {Workload} from "../../../../../../../api/subscriptions/legacyLeitner/workload";
import {Cardsets} from "../../../../../../../api/subscriptions/cardsets";
import {LeitnerLearningPhase} from "../../../../../../../api/subscriptions/leitner/leitnerLearningPhase";
import {Leitner} from "../../../../../../../api/subscriptions/legacyLeitner/leitner";
import {LeitnerLearningWorkload} from "../../../../../../../api/subscriptions/leitner/leitnerLearningWorkload";

function leitnerLearningWorkload() {
	let groupName = "leitnerLearningWorkload Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);
	let itemName = "leitnerLearningWorkload move from workload";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let leitnerWorkload = Workload.find({}).fetch();
	if (leitnerWorkload.length) {
		leitnerWorkload.forEach((workload) => {
			let cardset = Cardsets.findOne({_id: workload.cardset_id});
			if (cardset !== undefined && workload.leitner !== undefined) {
				let workloadIsBonus = workload.leitner.bonus;
				let workloadIsActive = Leitner.findOne({
					cardset_id: workload.cardset_id,
					user_id: workload.user_id}) !== undefined;
				if (workloadIsActive) {
					let newWorkloadObject = _.clone(workload.leitner);
					newWorkloadObject.user_id = workload.user_id;
					newWorkloadObject.cardset_id = workload.cardset_id;
					newWorkloadObject.isBonus = newWorkloadObject.bonus;
					newWorkloadObject.createdAt = newWorkloadObject.dateJoinedBonus;
					newWorkloadObject.isActive = newWorkloadObject.active;
					newWorkloadObject.activeCardCount = newWorkloadObject.activeCount;
					newWorkloadObject.activationDate = newWorkloadObject.activeDate;
					newWorkloadObject.nextActivationDate = newWorkloadObject.nextDate;
					newWorkloadObject.gotFinished = newWorkloadObject.finished;
					newWorkloadObject.nextLowestPriority = newWorkloadObject.nextLowestPriority.filter(value => !Number.isNaN(value));
					newWorkloadObject.performanceStats = newWorkloadObject.learningStatistics;
					delete newWorkloadObject.learningStatistics;
					delete newWorkloadObject.active;
					delete newWorkloadObject.activeCount;
					delete newWorkloadObject.activeDate;
					delete newWorkloadObject.nextDate;
					delete newWorkloadObject.finished;
					delete newWorkloadObject.dateJoinedBonus;
					delete newWorkloadObject.bonus;

					let learningPhase = LeitnerLearningPhase.findOne({
						cardset_id: cardset._id,
						isBonus: true
					});
					if (learningPhase !== undefined && workloadIsBonus) {
						newWorkloadObject.learning_phase_id = learningPhase._id;
					} else {
						newWorkloadObject.learning_phase_id = LeitnerLearningPhase.insert({cardset_id: workload.cardset_id});
					}

					LeitnerLearningWorkload.insert(newWorkloadObject);
				}
			}
			Workload.remove({_id: workload._id});
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}
	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerLearningWorkload
};
