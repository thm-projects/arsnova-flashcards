import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {LeitnerHistory} from "../../../../../api/subscriptions/leitnerHistory";

function leitnerHistoryMigrationStep() {
	let groupName = "LeitnerHistory Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "LeitnerHistory missedDeadline field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let leitnerHistory = LeitnerHistory.find({"missedDeadline": {$exists: false}}).fetch();
	if (leitnerHistory.length) {
		for (let i = 0; i < leitnerHistory.length; i++) {
			if (leitnerHistory[i].answer === 2) {
				LeitnerHistory.update({
						_id: leitnerHistory[i]._id
					},
					{
						$set: {
							missedDeadline: true
						},
						$unset: {
							answer: ""
						}
					}
				);
			} else {
				LeitnerHistory.update({
						_id: leitnerHistory[i]._id
					},
					{
						$set: {
							missedDeadline: false
						}
					}
				);
			}
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerHistoryMigrationStep
};
