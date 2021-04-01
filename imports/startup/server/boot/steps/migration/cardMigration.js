import {Cards} from "../../../../../api/subscriptions/cards";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {CardType} from "../../../../../util/cardTypes";
import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import * as cardsetConfig from "../../../../../config/cardset";

function cardMigrationStep() {
	let groupName = "Card Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Cards centerTextElement field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let cards = Cards.find({centerTextElement: {$exists: false}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			let cardset = Cardsets.findOne({_id: cards[i].cardset_id}, {fields: {_id: 1, cardType: 1}});
			if (cardset !== undefined) {
				Cards.update({
						_id: cards[i]._id
					},
					{
						$set: {
							centerTextElement: CardType.setDefaultCenteredText(cardset.cardType, 1)
						},
						$unset: {
							centerText: 1
						}
					}
				);
			}
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards alignType field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({alignType: {$exists: false}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			let cardset = Cardsets.findOne({_id: cards[i].cardset_id}, {fields: {_id: 1, cardType: 1}});
			if (cardset !== undefined) {
				Cards.update({
						_id: cards[i]._id
					},
					{
						$set: {
							alignType: CardType.setDefaultCenteredText(cardset.cardType, 2)
						}
					}
				);
			}
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards date field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({date: {$exists: false}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						date: new Date()
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards learningGoalLevel field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({learningGoalLevel: {$exists: false}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						learningGoalLevel: 0
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards backgroundStyle field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({backgroundStyle: {$exists: false}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						backgroundStyle: 0
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards originalAuthorName field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({originalAuthorName: {$exists: false}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						originalAuthorName: {
							legacyName: cards[i].originalAuthor
						}
					},
					$unset: {
						originalAuthor: ""
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards transcripts to have no cardset assigned";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({cardType: 2, cardset_id: {$ne: "-1"}}).fetch();
	if (cards.length) {
		for (let i = 0; i < cards.length; i++) {
			let cardset = Cardsets.findOne({_id: cards[i].cardset_id});
			if (cardset !== undefined && !cardsetConfig.kindsOwnedByServer.includes(cardset.kind)) {
				Cards.update({
						_id: cards[i]._id
					},
					{
						$set: {
							cardset_id: "-1"
						}
					}
				);
			}
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cards learningTime field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cards = Cards.find({"learningTime": {$exists: false}}).fetch();
	if (cards.length) {
		let learningTime = {
			initial: -1,
			repeated: -1
		};
		for (let i = 0; i < cards.length; i++) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						learningTime: learningTime
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
	cardMigrationStep
};
