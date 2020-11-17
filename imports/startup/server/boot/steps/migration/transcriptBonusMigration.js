import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {TranscriptBonus} from "../../../../../api/subscriptions/transcriptBonus";

function transcriptBonusMigrationStep() {
	let groupName = "TranscriptBonus Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "TranscriptBonus deadlineEditing field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let transcriptBonus = TranscriptBonus.find({deadlineEditing: {$exists: false}}, {fields: {_id: 1, deadline: 1}}).fetch();
	if (transcriptBonus.length) {
		for (let i = 0; i < transcriptBonus.length; i++) {
			TranscriptBonus.update({
					_id: transcriptBonus[i]._id
				},
				{
					$set: {
						deadlineEditing: transcriptBonus[i].deadline
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "TranscriptBonus stars field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	transcriptBonus = TranscriptBonus.find({stars: {$exists: false}}, {fields: {_id: 1}}).fetch();
	if (transcriptBonus.length) {
		for (let i = 0; i < transcriptBonus.length; i++) {
			TranscriptBonus.update({
					_id: transcriptBonus[i]._id
				},
				{
					$set: {
						stars: 1,
						reasons: []
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "TranscriptBonus rating field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	transcriptBonus = TranscriptBonus.find({"rating": {$exists: false}}).fetch();
	if (transcriptBonus.length) {
		for (let i = 0; i < transcriptBonus.length; i++) {
			TranscriptBonus.update({
					_id: transcriptBonus[i]._id
				},
				{
					$set: {
						rating: 0
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
	transcriptBonusMigrationStep
};
