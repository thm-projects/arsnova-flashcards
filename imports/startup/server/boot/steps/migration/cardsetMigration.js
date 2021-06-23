import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {Ratings} from "../../../../../api/subscriptions/ratings";
import {CardType} from "../../../../../util/cardTypes";
import {Meteor} from "meteor/meteor";
import {Cards} from "../../../../../api/subscriptions/cards";

function cardsetMigrationStep() {
	let groupName = "Cardset Migration";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Cardsets wordcloud field";
	let type = TYPE_MIGRATE;
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	let cardsets = Cardsets.find({wordcloud: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						wordcloud: false
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets raterCount field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({raterCount: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						raterCount: Number(Ratings.find({cardset_id: cardsets[i]._id}).count())
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets editors field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({editors: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						editors: []
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets cardType field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({cardType: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						cardType: 0
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets difficulty field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({difficulty: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						difficulty: 1
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets shuffled field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({shuffled: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						shuffled: false,
						cardGroups: [""]
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets useCase field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({useCase: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						useCase: {
							enabled: false,
							priority: 0
						}
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets totalQuantity field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({shuffled: true}).fetch();
	if (cardsets.length) {
		let totalQuantity;
		let cardGroupsCardset;
		for (let i = 0; i < cardsets.length; i++) {
			totalQuantity = 0;
			for (let k = 0; k < cardsets[i].cardGroups.length; k++) {
				cardGroupsCardset = Cardsets.find(cardsets[i].cardGroups[k]).fetch();
				if (cardGroupsCardset.length > 0) {
					totalQuantity += cardGroupsCardset[0].quantity;
				}
			}
			Cardsets.update(cardsets[i]._id, {
				$set: {
					quantity: totalQuantity
				}
			});
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets originalAuthorName field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({originalAuthorName: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						originalAuthorName: {
							legacyName: cardsets[i].originalAuthor
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

	itemName = "Cardsets noDifficulty field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({}, {fields: {_id: 1, cardType: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						noDifficulty: !CardType.gotDifficultyLevel(cardsets[i].cardType)
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets leitner card index";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({shuffled: true}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets relevance field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({relevance: {$exists: true}}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$unset: {
						relevance: ""
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets rating";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Meteor.call('updateCardsetRating', cardsets[i]._id);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets sortType field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({sortType: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						sortType: 0
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets lecturerAuthorized field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({lecturerAuthorized: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						lecturerAuthorized: false
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets cards owner";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find().fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cards.update({
					cardset_id: cardsets[i]._id,
					owner: {$exists: false}
				},
				{
					$set: {
						owner: cardsets[i].owner,
						cardType: cardsets[i].cardType
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets transcriptBonus.dates field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({'transcriptBonus.dates': {$exists: true}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			let lectures = [];
			for (let d = 0; d < cardsets[i].transcriptBonus.dates.length; d++) {
				let lecture = {
					date: cardsets[i].transcriptBonus.dates[d]
				};
				lectures.push(lecture);
			}
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						'transcriptBonus.lectures': lectures
					},
					$unset: {
						'transcriptBonus.dates': ""
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets fragJetzt & arsnovaClick fields";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({"fragJetzt": {$exists: false}}).fetch();
	if (cardsets.length) {
		let fragJetzt = {
			session: "",
			overrideOnlyEmptySessions: true
		};
		let arsnovaClick = {
			session: "",
			overrideOnlyEmptySessions: true
		};
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						fragJetzt: fragJetzt,
						arsnovaClick: arsnovaClick
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
	cardsetMigrationStep
};
