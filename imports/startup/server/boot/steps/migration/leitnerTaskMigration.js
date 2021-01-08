import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {LeitnerTasks} from "../../../../../api/subscriptions/leitnerTasks";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {LeitnerUtilities} from "../../../../../util/leitner";

function leitnerTaskMigrationStep() {
	let groupName = "LeitnerTasks Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "LeitnerTasks strictWorkloadTimer field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let leitnerTasks = LeitnerTasks.find({"strictWorkloadTimer": {$exists: false}}).fetch();
	if (leitnerTasks.length) {
		for (let i = 0; i < leitnerTasks.length; i++) {
			let cardset = Cardsets.findOne({_id: leitnerTasks[i].cardset_id});
			let pomodoroTimer = {
				quantity: 4,
				workLength: 30,
				break: 5
			};
			if (cardset !== undefined && cardset.pomodoroTimer !== undefined) {
				pomodoroTimer = cardset.pomodoroTimer;
			}
			LeitnerTasks.update({
					_id: leitnerTasks[i]._id
				},
				{
					$set: {
						pomodoroTimer: pomodoroTimer,
						strictWorkloadTimer: false,
						timer: {
							workload: {
								current: 0,
								completed: 0
							},
							break: {
								current: 0,
								completed: 0
							},
							status: 0,
							lastCallback: new Date()
						}
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "LeitnerTasks timelineStats field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	leitnerTasks = LeitnerTasks.find({"timelineStats": {$exists: false}}).fetch();
	if (leitnerTasks.length) {
		for (let i = 0; i < leitnerTasks.length; i++) {
			LeitnerUtilities.setCardTimeMedian(leitnerTasks[i]);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerTaskMigrationStep
};
