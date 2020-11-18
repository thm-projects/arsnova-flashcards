import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {Wozniak} from "../../../../../api/subscriptions/wozniak";

function wozniakMigrationStep() {
	let groupName = "Wozniak Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Wozniak skipped field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let wozniak = Wozniak.find({skipped: {$exists: true}}).fetch();
	if (wozniak.length) {
		for (let i = 0; i < wozniak.length; i++) {
			Wozniak.update({
					_id: wozniak[i]._id
				},
				{
					$unset: {
						skipped: ""
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Wozniak viewedPDF field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	wozniak = Wozniak.find({"viewedPDF": {$exists: false}}).fetch();
	if (wozniak.length) {
		for (let i = 0; i < wozniak.length; i++) {
			Wozniak.update({
					_id: wozniak[i]._id
				},
				{
					$set: {
						viewedPDF: false
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	wozniakMigrationStep
};
