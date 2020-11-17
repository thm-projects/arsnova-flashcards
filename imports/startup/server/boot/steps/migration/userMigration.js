import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../../util/styles";

function userMigrationStep() {
	let groupName = "User Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Users selectedLanguage field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let users = Meteor.users.find({selectedLanguage: {$exists: true}}).fetch();
	if (users.length) {
		Utilities.debugServerBoot(config.PROCESS_RECORDING, itemName, type, users.length);
		for (let i = 0; i < users.length; i++) {
			Meteor.users.update({
					_id: users[i]._id
				},
				{
					$set: {
						"profile.locale": users[i].selectedLanguage
					},
					$unset: {
						selectedLanguage: ""
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Users counter fields";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	users = Meteor.users.find({"count.cardsets": {$exists: false}}, {fields: {_id: 1}}).fetch();
	if (users.length) {
		for (let i = 0; i < users.length; i++) {
			Meteor.call('updateCardsetCount', users[i]._id);
			Meteor.call('updateTranscriptCount', users[i]._id);
			Meteor.call('updateWorkloadCount', users[i]._id);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Users fullscreen.settings fields";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	users = Meteor.users.find({"fullscreen.settings": {$exists: false}}).fetch();
	if (users.length) {
		Utilities.debugServerBoot(config.PROCESS_RECORDING, itemName, type, users.length);
		for (let i = 0; i < users.length; i++) {
			let defaultFullscreenSettings = {
				presentation: ServerStyle.getDefaultFullscreenMode(1, users[i]._id),
				demo: ServerStyle.getDefaultFullscreenMode(2, users[i]._id),
				leitner: ServerStyle.getDefaultFullscreenMode(3, users[i]._id),
				wozniak: ServerStyle.getDefaultFullscreenMode(4, users[i]._id)
			};
			Meteor.users.update({
				_id: users[i]._id
			}, {
				$set: {
					"fullscreen.settings": defaultFullscreenSettings
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
	userMigrationStep
};
