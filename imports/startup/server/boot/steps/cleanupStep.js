import {Meteor} from "meteor/meteor";
import {LeitnerUserCardStats} from "../../../../api/subscriptions/leitner/leitnerUserCardStats";
import {Wozniak} from "../../../../api/subscriptions/wozniak";
import {LeitnerLearningWorkload} from "../../../../api/subscriptions/leitner/leitnerLearningWorkload";
import {Ratings} from "../../../../api/subscriptions/ratings";
import {WebPushSubscriptions} from "../../../../api/subscriptions/webPushNotifications";
import {Paid} from "../../../../api/subscriptions/paid";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {CardType} from "../../../../util/cardTypes";
import * as config from "../../../../config/serverBoot";
import {Utilities} from "../../../../util/utilities";
import {TYPE_CLEANUP} from "../../../../config/serverBoot";

function removeDeletedUsers() {
	let users = Meteor.users.find({}, {fields: {_id: 1}}).fetch();
	let userFilter = [];
	for (let i = 0; i < users.length; i++) {
		userFilter.push(users[i]._id);
	}
	if (userFilter.length === Meteor.users.find({}).count()) {
		LeitnerUserCardStats.remove({
			user_id: {$nin: userFilter}
		});

		Wozniak.remove({
			user_id: {$nin: userFilter}
		});

		let workload = LeitnerLearningWorkload.find({user_id: {$nin: userFilter}}, {fields: {cardset_id: 1}}).fetch();

		LeitnerLearningWorkload.remove({
			user_id: {$nin: userFilter}
		});

		for (let i = 0; i < workload.length; i++) {
			Meteor.call('updateLearnerCount', workload[i].cardset_id);
		}

		Ratings.remove({
			user_id: {$nin: userFilter}
		});

		WebPushSubscriptions.remove({
			user_id: {$nin: userFilter}
		});

		Paid.remove({
			user_id: {$nin: userFilter}
		});
	}
}

function cleanWorkload() {
	let cardsets = Cardsets.find({shuffled: false, cardType: {$nin: CardType.getCardTypesWithLearningModes()}}, {fields: {_id: 1}}).fetch();
	let filter = [];
	let cardsetsLength = cardsets.length;
	for (let i = 0; i < cardsetsLength; i++) {
		filter.push(cardsets[i]._id);
	}
	LeitnerUserCardStats.remove({
		cardset_id: {$in: filter}
	});

	Wozniak.remove({
		cardset_id: {$in: filter}
	});

	LeitnerLearningWorkload.remove({
		cardset_id: {$in: filter}
	});
}

export function cleanupStep() {
	let groupName = "Database Cleanup";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Cardsets with cardType 2 'Transcripts'";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, TYPE_CLEANUP);
	Cardsets.remove({cardType: 2});
	Utilities.debugServerBoot(config.END_RECORDING, itemName, TYPE_CLEANUP);

	itemName = "old Demo Content";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, TYPE_CLEANUP);
	Meteor.users.remove(config.initDemoCardsetUser()[0]._id);
	Meteor.call('deleteDemoCardsets');
	Utilities.debugServerBoot(config.END_RECORDING, itemName, TYPE_CLEANUP);

	itemName = "deleted User Content";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, TYPE_CLEANUP);
	removeDeletedUsers();
	Utilities.debugServerBoot(config.END_RECORDING, itemName, TYPE_CLEANUP);

	itemName = "Cleanup Workload";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	cleanWorkload();
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	cleanupStep
};
