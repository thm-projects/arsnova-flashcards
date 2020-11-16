import {Utilities} from "../../../../util/utilities";
import * as config from "../../../../config/serverBoot";
import {AdminSettings} from "../../../../api/subscriptions/adminSettings";
import {TYPE_INITIALIZE} from "../../../../config/serverBoot";

function adminSettingsStep() {
	let groupName = "Admin Settings Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "AdminSettings seqSettings document";
	let type = TYPE_INITIALIZE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let itemNotFoundStatus = !AdminSettings.findOne({name: "seqSettings"});
	if (itemNotFoundStatus) {
		AdminSettings.insert({
			name: "seqSettings",
			seqOne: 7,
			seqTwo: 30,
			seqThree: 90
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "AdminSettings mailSettings document";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	itemNotFoundStatus = !AdminSettings.findOne({name: "mailSettings"});
	if (itemNotFoundStatus) {
		AdminSettings.insert({
			name: "mailSettings",
			enabled: false
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "AdminSettings pushSettings document";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	itemNotFoundStatus = !AdminSettings.findOne({name: "pushSettings"});
	if (itemNotFoundStatus) {
		AdminSettings.insert({
			name: "pushSettings",
			enabled: true
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "AdminSettings wordcloudPomodoroSettings document";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	itemNotFoundStatus = !AdminSettings.findOne({name: "wordcloudPomodoroSettings"});
	if (itemNotFoundStatus) {
		AdminSettings.insert({
			name: "wordcloudPomodoroSettings",
			enabled: true
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "AdminSettings plantUMLServerSettings document";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	itemNotFoundStatus = !AdminSettings.findOne({name: "plantUMLServerSettings"});
	if (itemNotFoundStatus) {
		AdminSettings.insert({
			name: "plantUMLServerSettings",
			url: "https://www.plantuml.com/plantuml"
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "AdminSettings testNotifications document";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	itemNotFoundStatus = !AdminSettings.findOne({name: "testNotifications"});
	if (itemNotFoundStatus) {
		AdminSettings.insert({
			name: "testNotifications",
			target: undefined
		});
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	adminSettingsStep
};
