import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";
import {LeitnerUtilities} from "../../../../../../../util/leitner";
import {Meteor} from "meteor/meteor";
import * as leitnerConfig from "../../../../../../../config/leitner";
import {Cardsets} from "../../../../../../../api/subscriptions/cardsets";
import {Bonus} from "../../../../../../../util/bonus";
import {Workload} from "../../../../../../../api/subscriptions/legacyLeitner/workload";
import {Leitner} from "../../../../../../../api/subscriptions/legacyLeitner/leitner";
import {LeitnerHistory} from "../../../../../../../api/subscriptions/legacyLeitner/leitnerHistory";
import {LeitnerTasks} from "../../../../../../../api/subscriptions/legacyLeitner/leitnerTasks";

// Deprecated. New Migrations will take place in learningStatistics/leitner/learningWorkload
function workloadMigrationStep() {
	let groupName = "Workload Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Workload leitner.active field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let workload = Workload.find({"leitner.active": {$exists: false}}).fetch();
	if (workload.length) {
		for (let i = 0; i < workload.length; i++) {
			LeitnerUtilities.updateLeitnerWorkload(workload[i].cardset_id, workload[i].user_id);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Workload leitner.nextLowestPriority field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	workload = Workload.find({"leitner.nextLowestPriority": {$exists: false}}).fetch();
	if (workload.length) {
		for (let i = 0; i < workload.length; i++) {
			Workload.update({
					user_id: workload[i].user_id,
					cardset_id: workload[i].cardset_id
				},
				{
					$set: {
						"leitner.nextLowestPriority": [-1, -1, -1, -1, -1]
					}
				}
			);
			Leitner.update({
					user_id: workload[i].user_id,
					cardset_id: workload[i].cardset_id
				},
				{
					$set: {
						"priority": 0
					}
				}, {multi: true});
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	// Move old leitner history to new session system
	itemName = "Workload leitner.tasks field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	workload = Workload.find({"leitner.tasks": {$exists: true}}).fetch();
	if (workload.length) {
		for (let i = 0; i < workload.length; i++) {
			let user = Meteor.users.findOne(workload[i].user_id);

			let tasks = workload[i].leitner.tasks;
			let lastCount = 0;
			for (let t = 0; t < tasks.length; t++) {
				let missedDeadline = false;
				let foundReset = LeitnerHistory.findOne({
					user_id: user._id,
					cardset_id: workload[i].cardset_id,
					task_id: t,
					missedDeadline: true
				});
				if (foundReset !== undefined) {
					missedDeadline = true;
				}
				let leitnerTask = LeitnerTasks.insert({
					cardset_id: workload[i].cardset_id,
					user_id: workload[i].user_id,
					session: 0,
					isBonus: workload[i].leitner.bonus,
					missedDeadline: missedDeadline,
					resetDeadlineMode: leitnerConfig.resetDeadlineMode,
					wrongAnswerMode: leitnerConfig.wrongAnswerMode,
					notifications: {
						mail: {
							active: user.mailNotification,
							sent: user.mailNotification,
							address: user.email
						},
						web: {
							active: user.webNotification,
							sent: user.webNotification
						}
					},
					createdAt: tasks[t]
				});

				LeitnerHistory.update({
						user_id: workload[i].user_id,
						cardset_id: workload[i].cardset_id,
						task_id: t
					},
					{
						$set: {
							task_id: leitnerTask
						},
						$unset: {
							missedDeadline: ""
						}
					}, {multi: true}
				);
				if (workload[i].leitner.bonus) {
					const cardsetWorkload = Cardsets.findOne({
							_id: workload[i].cardset_id
						},
						{
							fields: {_id: 0, workload: 1}
						}).workload;
					const [learnable, box6] = LeitnerHistory.find({
							task_id: leitnerTask
						},
						{
							fields: {_id: 0, box: 1}
						}).fetch()
						.reduce((acc, leitnerObj) => {
							acc[0]++;
							if (leitnerObj.box === 6) {
								acc[1]++;
							}
							return acc;
						}, [0, 0]);
					const currentBonus = Bonus.getAchievedBonus(box6, cardsetWorkload.bonus, learnable);
					LeitnerTasks.update({
							_id: leitnerTask
						},
						{
							$set: {
								bonusPoints: {
									atStart: lastCount,
									atEnd: currentBonus
								}
							}
						});
					lastCount = currentBonus;
				}
			}

			Workload.update({
					_id: workload[i]._id
				},
				{
					$unset: {
						"leitner.tasks": ""
					}
				});
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	workloadMigrationStep
};
