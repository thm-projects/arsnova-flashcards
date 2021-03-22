import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";
import {Cardsets} from "../../../../../../../api/subscriptions/cardsets";
import {Cards} from "../../../../../../../api/subscriptions/cards";
import {Leitner} from "../../../../../../../api/subscriptions/legacyLeitner/leitner";

// Deprecated. New Migrations will take place in learningStatistics/leitner/cardStats
function leitnerMigrationStep() {
	let groupName = "Leitner Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Leitner skipped field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let leitner = Leitner.find({skipped: {$exists: true}}).fetch();
	if (leitner.length) {
		for (let i = 0; i < leitner.length; i++) {
			Leitner.update({
					_id: leitner[i]._id
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

	itemName = "Leitner viewedPDF field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	leitner = Leitner.find({"viewedPDF": {$exists: false}}).fetch();
	if (leitner.length) {
		for (let i = 0; i < leitner.length; i++) {
			Leitner.update({
					_id: leitner[i]._id
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

	itemName = "Leitner original_cardset_id field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let cardsets = Cardsets.find({shuffled: true}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			leitner = Leitner.find({cardset_id: cardsets[i]._id, original_cardset_id: {$exists: false}}, {
				fields: {
					_id: 1,
					card_id: 1
				}
			}).fetch();
			for (let k = 0; k < leitner.length; k++) {
				let originalCardsetId = Cards.findOne({_id: leitner[k].card_id}).cardset_id;
				if (originalCardsetId !== undefined) {
					Leitner.update({
							_id: leitner[k]._id
						},
						{
							$set: {
								original_cardset_id: originalCardsetId
							}
						}
					);
				}
			}
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerMigrationStep
};
