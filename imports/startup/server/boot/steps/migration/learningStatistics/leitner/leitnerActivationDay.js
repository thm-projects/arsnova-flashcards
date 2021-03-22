import {Utilities} from "../../../../../../../util/utilities";
import * as config from "../../../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../../../config/serverBoot";

function leitnerActivationDay() {
	let groupName = "leitnerActivationDay Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);
	let itemName = "leitnerActivationDay move from leitnerTasks";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let dummy = [];
	if (dummy.length) {
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}
	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	leitnerActivationDay
};
