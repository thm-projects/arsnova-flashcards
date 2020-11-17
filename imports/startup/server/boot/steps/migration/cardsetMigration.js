import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/serverBoot";
import {TYPE_MIGRATE} from "../../../../../config/serverBoot";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {Ratings} from "../../../../../api/subscriptions/ratings";
import {CardType} from "../../../../../util/cardTypes";
import {Workload} from "../../../../../api/subscriptions/workload";
import {Leitner} from "../../../../../api/subscriptions/leitner";
import {Meteor} from "meteor/meteor";
import {Cards} from "../../../../../api/subscriptions/cards";
import * as bonusFormConfig from "../../../../../config/bonusForm";
import * as leitnerConfig from "../../../../../config/leitner";

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

	itemName = "Cardsets workload collection";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({learningActive: true}, {fields: {_id: 1, name: 1, learningActive: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			if (Workload.find({cardset_id: cardsets[i]._id}).count() === 0) {
				let learnerData = [];
				let userData = {};
				let usersLeitner = Leitner.find({cardset_id: cardsets[i]._id}, {
					fields: {
						user_id: 1,
						cardset_id: 1
					}
				}).fetch();
				let users = _.uniq(usersLeitner, false, function (d) {
					return d.user_id;
				});
				for (let k = 0; k < users.length; k++) {
					userData = {
						cardset_id: cardsets[i]._id,
						user_id: users[k].user_id,
						leitner: {
							bonus: true,
							dateJoinedBonus: new Date()
						}
					};
					learnerData.push(userData);
				}
				if (learnerData.length > 0) {
					Workload.batchInsert(learnerData);
				}
			}
			Meteor.call("updateLearnerCount", cardsets[i]._id);
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

	itemName = "Leitner original_cardset_id field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({shuffled: true}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			let leitner = Leitner.find({cardset_id: cardsets[i]._id, original_cardset_id: {$exists: false}}, {
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

	itemName = "Cardsets registrationPeriod field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({registrationPeriod: {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						registrationPeriod: cardsets[i].learningEnd
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets pomodoroTimer field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({pomodoroTimer: {$exists: false}, learningActive: true}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						'pomodoroTimer.quantity': 3,
						'pomodoroTimer.workLength': 25,
						'pomodoroTimer.breakLength': 5,
						'pomodoroTimer.soundConfig': [true, true, true]
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets workload.bonus.count field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({'workload.bonus.count': {$exists: false}}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Meteor.call('updateLearnerCount', cardsets[i]._id);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets workload.bonus.minLearned field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({'workload.bonus.minLearned': {$exists: false}}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						"workload.bonus.minLearned": bonusFormConfig.defaultMinLearned
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets workload.bonus.minLearned field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({learners: {$exists: true}}, {fields: {_id: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$unset: {
						learners: ""
					}
				}
			);
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

	itemName = "Cardsets transcriptBonus";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({transcriptBonus: {$exists: true}}, {fields: {_id: 1, transcriptBonus: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			if (cardsets[i].transcriptBonus.deadlineEditing === undefined) {
				Cardsets.update({
						_id: cardsets[i]._id
					},
					{
						$set: {
							"transcriptBonus.deadlineEditing": cardsets[i].transcriptBonus.deadline
						}
					}
				);
			}
			if (cardsets[i].transcriptBonus.minimumSubmissions === undefined) {
				Cardsets.update({
						_id: cardsets[i]._id
					},
					{
						$set: {
							"transcriptBonus.minimumSubmissions": cardsets[i].transcriptBonus.dates.length
						}
					}
				);
			}
			if (cardsets[i].transcriptBonus.minimumStars === undefined || cardsets[i].transcriptBonus.minimumStars > 5) {
				Cardsets.update({
						_id: cardsets[i]._id
					},
					{
						$set: {
							"transcriptBonus.minimumStars": 3
						}
					}
				);
			}
			if (cardsets[i].transcriptBonus.stats === undefined) {
				Meteor.call('updateTranscriptBonusStats', cardsets[i]._id);
			}
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

	itemName = "Cardsets got Workload";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			let gotWorkload = false;
			if (cardsets[i].shuffled) {
				if (Utilities.checkIfRepGotWorkloadCardset(cardsets[i])) {
					gotWorkload = true;
				}
			} else {
				gotWorkload = CardType.getCardTypesWithLearningModes().includes(cardsets[i].cardType);
			}

			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						"gotWorkload": gotWorkload
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets workload.simulator.errorCount field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({'workload.simulator.errorCount': {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						'workload.simulator.errorCount': [bonusFormConfig.defaultErrorCount]
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

	itemName = "Cardsets strictWorkloadTimer field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({"strictWorkloadTimer": {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						strictWorkloadTimer: leitnerConfig.strictWorkloadTimer
					}
				}
			);
		}
		Utilities.debugServerBoot(config.END_RECORDING, itemName, type);
	} else {
		Utilities.debugServerBoot(config.SKIP_RECORDING, itemName, type);
	}

	itemName = "Cardsets forceNotifications field";
	Utilities.debugServerBoot(config.START_RECORDING, itemName, type);
	cardsets = Cardsets.find({"forceNotifications": {$exists: false}}).fetch();
	if (cardsets.length) {
		for (let i = 0; i < cardsets.length; i++) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						forceNotifications: bonusFormConfig.defaultForceNotifications
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
