import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";
import {LeitnerTasks} from "../../../../../../../api/subscriptions/legacyLeitner/leitnerTasks";
import {LeitnerLearningWorkload} from "../../../../../../../api/subscriptions/leitner/leitnerLearningWorkload";
import {LeitnerHistory} from "../../../../../../../api/subscriptions/legacyLeitner/leitnerHistory";
import {LeitnerActivationDay} from "../../../../../../../api/subscriptions/leitner/leitnerActivationDay";
import {LeitnerPerformanceHistory} from "../../../../../../../api/subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningPhase} from "../../../../../../../api/subscriptions/leitner/leitnerLearningPhase";

function leitnerActivationDay() {
	let groupName = "leitnerActivationDay and leitnerPerformanceStats Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);
	let itemName = "leitnerActivationDay and leitnerPerformanceStats move from leitnerTasks and leitnerHistory";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let leitnerTasks = LeitnerTasks.find().count();
	if (leitnerTasks > 0) {
		let leitnerLearningWorkload = LeitnerLearningWorkload.find().fetch();
		if (leitnerLearningWorkload.length) {
			leitnerLearningWorkload.forEach(workload => {
				let highestSessionTask = LeitnerTasks.findOne({
					user_id: workload.user_id,
					cardset_id: workload.cardset_id
				}, {sort: {session: -1}});
				if (highestSessionTask !== undefined && highestSessionTask.session !== undefined) {
					let workloadLeitnerTasks = LeitnerTasks.find({
							user_id: workload.user_id,
							cardset_id: workload.cardset_id,
							session: highestSessionTask.session
						}).fetch();
					workloadLeitnerTasks.forEach(task => {
						let leitnerActivationDay = _.clone(task);
						delete leitnerActivationDay._id;
						let learningPhase = LeitnerLearningPhase.findOne({_id: workload.learning_phase_id});
						leitnerActivationDay.learning_phase_id = workload.learning_phase_id;
						leitnerActivationDay.workload_id = workload._id;
						leitnerActivationDay.performanceStats = leitnerActivationDay.learningStatistics;
						leitnerActivationDay.lastAnsweredAt = leitnerActivationDay.lastAnswerDate;
						delete leitnerActivationDay.learningStatistics;
						delete leitnerActivationDay.lastAnswerDate;
						if (leitnerActivationDay.daysBeforeReset === undefined) {
							leitnerActivationDay.daysBeforeReset = learningPhase.daysBeforeReset;
						}
						if (leitnerActivationDay.pomodoroTimer === undefined) {
							leitnerActivationDay.pomodoroTimer = learningPhase.pomodoroTimer;
						}
						let activationDayID = LeitnerActivationDay.insert(leitnerActivationDay);
						let leitnerHistory = LeitnerHistory.find({task_id: task._id}).fetch();
						leitnerHistory.forEach(history => {
							let performanceHistory = _.clone(history);
							delete performanceHistory._id;
							delete performanceHistory.task_id;
							performanceHistory.activation_day_id = activationDayID;
							performanceHistory.learning_phase_id = workload.learning_phase_id;
							performanceHistory.workload_id = workload._id;
							LeitnerPerformanceHistory.insert(performanceHistory);
							LeitnerHistory.remove({_id: history._id});
						});
						LeitnerTasks.remove({_id: task._id});
					});
				}
			});
			LeitnerTasks.remove({}, {multi: true});
			LeitnerHistory.remove({}, {multi: true});
		}

		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}
	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerActivationDay
};
