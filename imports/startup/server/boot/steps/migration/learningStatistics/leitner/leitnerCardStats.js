import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";
import {Leitner} from "../../../../../../../api/subscriptions/legacyLeitner/leitner";
import {LeitnerLearningWorkload} from "../../../../../../../api/subscriptions/leitner/leitnerLearningWorkload";
import {LeitnerUserCardStats} from "../../../../../../../api/subscriptions/leitner/leitnerUserCardStats";
import {LearningCardStats} from "../../../../../../../util/learningCardStatus";

function leitnerCardStats() {
	let groupName = "leitnerCardStats Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);
	let itemName = "leitnerUserCardStats move from leitner";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let leitner = Leitner.find({}).fetch();
	if (leitner.length) {
		leitner.forEach((leitnerObject) => {
			let leitnerLearningWorkload = LeitnerLearningWorkload.findOne({user_id: leitnerObject.user_id, cardset_id: leitnerObject.cardset_id});
			if (leitnerLearningWorkload !== undefined) {
				let newLeitnerObject = _.clone(leitnerObject);
				newLeitnerObject.learning_phase_id = leitnerLearningWorkload.learning_phase_id;
				newLeitnerObject.isActive = leitnerObject.active;
				newLeitnerObject.nextPossibleActivationDate = leitnerObject.nextDate;
				newLeitnerObject.activatedSinceDate = leitnerObject.currentDate;
				newLeitnerObject.workload_id = leitnerLearningWorkload._id;
				if (leitnerObject.submitted !== undefined) {
					newLeitnerObject.submittedAnswer = leitnerObject.submitted;
					delete newLeitnerObject.submitted;
				}
				delete newLeitnerObject.active;
				delete newLeitnerObject.nextDate;
				delete newLeitnerObject.currentDate;
				delete newLeitnerObject._id;
				if (isNaN(newLeitnerObject.priority)) {
					newLeitnerObject.priority = 0;
				}
				newLeitnerObject.stats = LearningCardStats.calculateUserCardStats(newLeitnerObject.card_id, newLeitnerObject.workload_id, newLeitnerObject.user_id);
				LeitnerUserCardStats.insert(newLeitnerObject);
			}
			Leitner.remove({_id: leitnerObject._id});
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}
	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerCardStats
};
