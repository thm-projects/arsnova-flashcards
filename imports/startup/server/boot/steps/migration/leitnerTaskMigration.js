import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {LeitnerTasks} from "../../../../../api/subscriptions/leitnerTasks";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {LearningStatisticsUtilities} from "../../../../../util/learningStatistics";
import {Workload} from "../../../../../api/subscriptions/workload";
import {LeitnerHistory} from "../../../../../api/subscriptions/leitnerHistory";
import {Bonus} from "../../../../../util/bonus";

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

	itemName = "Remove timelineStats fields";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	leitnerTasks = LeitnerTasks.find({"timelineStats": {$exists: true}}).count();
	if (leitnerTasks > 0) {
		LeitnerTasks.update({}, {$unset: {"timelineStats": ""}}, {multi: true});
		Workload.update({}, {$unset: {"leitner.timelineStats": ""}}, {multi: true});
		Cardsets.update({}, {$unset: {"leitner.timelineStats": ""}}, {multi: true});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "LearningStatistics median, arithmeticMean and standardDeviation fields";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	leitnerTasks = LeitnerTasks.find({"learningStatistics": {$exists: false}}).fetch();
	if (leitnerTasks.length) {
		for (let i = 0; i < leitnerTasks.length; i++) {
			LearningStatisticsUtilities.setGlobalStatistics(leitnerTasks[i]);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "BonusPoints atStart and atEnd fields";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	leitnerTasks = LeitnerTasks.find({
			isBonus: true,
			$or: [
				{"bonusPoints.atStart": {$exists: false}},
				{"bonusPoints.atEnd": {$exists: false}}
			]
		},
		{
			sort: {createdAt: 1},
			fields: {_id: 1, user_id: 1, cardset_id: 1, session: 1}
		}).fetch();
	//This method works only, if all data is migrated at once
	if (leitnerTasks.length) {
		const cache = {};
		leitnerTasks.forEach(elem => {
			const cardset_id = elem.cardset_id;
			if (!cache[cardset_id]) {
				cache[cardset_id] = {
					cardset: Cardsets.findOne(cardset_id),
					playerBonusPointCache: {}
				};
			}
			const currentCacheEntry = cache[cardset_id];
			if (!currentCacheEntry.cardset) {
				return;
			}
			let learnable = 0, box6 = 0;
			LeitnerHistory.find({
					task_id: elem._id
				},
				{
					fields: {box: 1, _id: 0}
				}).fetch()
				.forEach(leitnerObj => {
					learnable++;
					if (leitnerObj.box === 6) {
						box6++;
					}
				});
			const endBonusPoints = Bonus.getAchievedBonus(box6, currentCacheEntry.cardset.workload, learnable);
			const extendedUserId = elem.user_id + elem.session;
			//The cache only works if all data is migrated at once
			const startBonusPoints = currentCacheEntry.playerBonusPointCache[extendedUserId] || 0;
			currentCacheEntry.playerBonusPointCache[extendedUserId] = endBonusPoints;
			LeitnerTasks.update({_id: elem._id}, {
				$set: {
					bonusPoints: {
						atStart: startBonusPoints,
						atEnd: endBonusPoints
					}
				}
			});
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerTaskMigrationStep
};
