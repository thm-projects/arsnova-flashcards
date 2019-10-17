import {Meteor} from "meteor/meteor";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {ColorThemes} from "../../api/theme.js";
import {Learned, Leitner, LeitnerHistory, Wozniak, Workload} from "../../api/learned.js";
import {AdminSettings} from "../../api/adminSettings";
import {CronScheduler} from "../../../server/cronjob.js";
import {Ratings} from "../../api/ratings";
import {CardType} from "../../api/cardTypes";
import {WebPushSubscriptions} from "../../api/webPushSubscriptions";
import {Paid} from "../../api/paid";
import {TranscriptBonus} from "../../api/transcriptBonus";
import {LeitnerUtilities} from "../../api/leitner";
import {Utilities} from "../../api/utilities";
import * as bonusFormConfig from "../../config/bonusForm.js";

var initColorThemes = function () {
	return [{
		"_id": "default",
		"name": "mit Hintergrundbildern"
	}, {
		"_id": "contrast",
		"name": "ohne und mit mehr Kontrast"
	}];
};

var initTestNotificationsCardset = function () {
	return [
		{
			"_id": "NotificationsTestCardset",
			"name": "Notifications Test",
			"description": "This cardset tests the E-Mail and web notifications of 🍅cards.",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": "NotificationsTestUser",
			"visible": false,
			"ratings": true,
			"kind": "server",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"rating": 0,
			"raterCount": 0,
			"quantity": 5,
			"license": [
				"by",
				"nc",
				"nd"
			],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 30,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"registrationPeriod": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"editors": [],
			"shuffled": false,
			"cardGroups": [],
			"cardType": 0,
			"difficulty": 1,
			"noDifficulty": CardType.gotDifficultyLevel(1)
		}
	];
};

var initTestNotificationsCards = function () {
	return [
		{
			"_id": "NotificationsTestCard1",
			"subject": "NotificationsTest: Card Nr. 1",
			"front": "Front of NotificationsTest: Card Nr. 1",
			"back": "Back of NotificationsTest: Card Nr. 1",
			"hint": "Hint of NotificationsTest: Card Nr. 1",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false, false, false],
			"alignType": [1, 1, 1, 1, 1, 1],
			"learningGoalLevel": 0,
			"backgroundStyle": 0,
			"owner": "NotificationsTestUser",
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard2",
			"subject": "NotificationsTest: Card Nr. 2",
			"front": "Front of NotificationsTest: Card Nr. 2",
			"back": "Back of NotificationsTest: Card Nr. 2",
			"hint": "Hint of NotificationsTest: Card Nr. 2",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false, false, false],
			"alignType": [1, 1, 1, 1, 1, 1],
			"learningGoalLevel": 1,
			"backgroundStyle": 0,
			"owner": "NotificationsTestUser",
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard3",
			"subject": "NotificationsTest: Card Nr. 3",
			"front": "Front of NotificationsTest: Card Nr. 3",
			"back": "Back of NotificationsTest: Card Nr. 3",
			"hint": "Hint of NotificationsTest: Card Nr. 3",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false, false, false],
			"alignType": [1, 1, 1, 1, 1, 1],
			"learningGoalLevel": 2,
			"backgroundStyle": 0,
			"owner": "NotificationsTestUser",
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard4",
			"subject": "NotificationsTest: Card Nr. 4",
			"front": "Front of NotificationsTest: Card Nr. 4",
			"back": "Back of NotificationsTest: Card Nr. 4",
			"hint": "Hint of NotificationsTest: Card Nr. 4",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false, false, false],
			"alignType": [1, 1, 1, 1, 1, 1],
			"learningGoalLevel": 3,
			"backgroundStyle": 0,
			"owner": "NotificationsTestUser",
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard5",
			"subject": "NotificationsTest: Card Nr. 5",
			"front": "Front of NotificationsTest: Card Nr. 5",
			"back": "Back of NotificationsTest: Card Nr. 5",
			"hint": "Hint of NotificationsTest: Card Nr. 5",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false, false, false],
			"alignType": [1, 1, 1, 1, 1, 1],
			"learningGoalLevel": 4,
			"backgroundStyle": 0,
			"owner": "NotificationsTestUser",
			"cardType": 0
		}
	];
};

var initTestNotificationsLearned = function () {
	return [
		{
			"_id": "NotificationsTestLearned1",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard1",
			"user_id": "NotificationsTestUser",
			"box": 1,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date()
		},
		{
			"_id": "NotificationsTestLearned2",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard2",
			"user_id": "NotificationsTestUser",
			"box": 1,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date()
		},
		{
			"_id": "NotificationsTestLearned3",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard3",
			"user_id": "NotificationsTestUser",
			"box": 1,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date()
		},
		{
			"_id": "NotificationsTestLearned4",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard4",
			"user_id": "NotificationsTestUser",
			"box": 1,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date()
		},
		{
			"_id": "NotificationsTestLearned5",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard5",
			"user_id": "NotificationsTestUser",
			"box": 1,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date()
		}
	];
};

var initTestNotificationsUser = function () {
	return [
		{
			"_id": "NotificationsTestUser",
			"createdAt": (new Date().setFullYear(2017, 9, 1)),
			"username": "NotificationsTestUser",
			"roles": [
				"standard",
				"university"
			],
			"services": {
				"resume": {
					"loginTokens": [
						{
							"when": (new Date().setFullYear(2017, 9, 1)),
							"hashedToken": "faeb4d60dd149329ca9ff491c3dcf0b97977cf0d7e025ee056ee4fb9a994fb6ec466b412a37352f2028d1307eb4793972c094ba9c8f0f768cae3997ef0f66176"
						}
					]
				}
			},
			"status": {
				"online": false,
				"lastLogin": {
					"date": (new Date().setFullYear(2017, 9, 1)),
					"ipAddr": "127.0.0.1",
					"userAgent": ""
				}
			},
			"visible": true,
			"email": "placeholder@localhost.com",
			"birthname": "Place",
			"givenname": "Holder",
			"lvl": 17,
			"lastOnAt": (new Date().setFullYear(2017, 9, 5)),
			"daysInRow": 0,
			"selectedColorTheme": "default",
			"mailNotification": true,
			"webNotification": false,
			"profile": {
				"birthname": "User",
				"givenname": "NotificationsTest",
				"completed": true,
				"name": "NotificationsTestUser",
				"title": ""
			},
			"blockedtext": null
		}
	];
};

var initDemoCardsetUser = function () {
	return [
		{
			"_id": ".cards",
			"createdAt": (new Date().setFullYear(2017, 9, 1)),
			"username": ".cards",
			"roles": [
				"standard",
				"university"
			],
			"services": {
				"resume": {
					"loginTokens": [
						{
							"when": (new Date().setFullYear(2017, 10, 1)),
							"hashedToken": "b2e01ff62ac8564da8b76a8e69ef2b8f8c1546849626f89886ba311949f22b81fa6abcf3421fe09156662d6e20c31a5175bdb44b481540ebb29ec86cadbf8b82"
						}
					]
				}
			},
			"status": {
				"online": false,
				"lastLogin": {
					"date": (new Date().setFullYear(2017, 10, 1)),
					"ipAddr": "127.0.0.1",
					"userAgent": ""
				}
			},
			"visible": true,
			"email": "",
			"birthname": ".cards",
			"givenname": "",
			"lvl": 0,
			"lastOnAt": (new Date().setFullYear(2017, 9, 5)),
			"daysInRow": 0,
			"selectedColorTheme": "default",
			"mailNotification": true,
			"webNotification": false,
			"profile": {
				"birthname": ".cards",
				"givenname": "",
				"completed": true,
				"name": ".cards",
				"title": ""
			},
			"blockedtext": null
		}
	];
};

function removeDeletedUsers() {
	let users = Meteor.users.find({}, {fields: {_id: 1}}).fetch();
	let userFilter = [];
	for (let i = 0; i < users.length; i++) {
		userFilter.push(users[i]._id);
	}
	if (userFilter.length === Meteor.users.find({}).count()) {
		Leitner.remove({
			user_id: {$nin: userFilter}
		});

		Wozniak.remove({
			user_id: {$nin: userFilter}
		});

		let workload = Workload.find({user_id: {$nin: userFilter}}, {fields: {cardset_id: 1}}).fetch();

		Workload.remove({
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
	Leitner.remove({
		cardset_id: {$in: filter}
	});

	Wozniak.remove({
		cardset_id: {$in: filter}
	});

	Workload.remove({
		cardset_id: {$in: filter}
	});
}

function setupDatabaseIndex() {
	Leitner._ensureIndex({user_id: 1, cardset_id: 1, original_cardset_id: 1, active: 1});
	LeitnerHistory._ensureIndex({user_id: 1, cardset_id: 1, original_cardset_id: 1, task_id: 1, box: 1, dateAnswered: 1});
	Wozniak._ensureIndex({user_id: 1, cardset_id: 1});
	Workload._ensureIndex({cardset_id: 1, user_id: 1});
	Cards._ensureIndex({cardset_id: 1, subject: 1});
	WebPushSubscriptions._ensureIndex({user_id: 1});
	Ratings._ensureIndex({cardset_id: 1, user_id: 1});
	Cardsets._ensureIndex({name: 1, owner: 1, kind: 1, shuffled: 1, cardType: 1, difficulty: 1, wordcloud: 1, learningActive: 1});
	TranscriptBonus._ensureIndex({cardset_id: 1, user_id: 1});
	Meteor.users._ensureIndex({"profile.birthname": 1, "profile.givenname": 1, "profile.name": 1});
}

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();
	let themes = initColorThemes();
	let testNotificationsCardset = initTestNotificationsCardset();
	let testNotificationsCards = initTestNotificationsCards();
	let testNotificationsLearned = initTestNotificationsLearned();
	let testNotificationsUser = initTestNotificationsUser();
	let demoCardsetUser = initDemoCardsetUser();
	setupDatabaseIndex();
	cleanWorkload();
	process.env.MAIL_URL = Meteor.settings.mail.url;
	SSR.compileTemplate("newsletter", Assets.getText("newsletter/newsletter.html"));
	Template.newsletter.helpers({
		getDocType: function () {
			return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		}
	});

	if (!AdminSettings.findOne({name: "seqSettings"})) {
		AdminSettings.insert({
			name: "seqSettings",
			seqOne: 7,
			seqTwo: 30,
			seqThree: 90
		});
	}

	if (!AdminSettings.findOne({name: "mailSettings"})) {
		AdminSettings.insert({
			name: "mailSettings",
			enabled: false
		});
	}

	if (!AdminSettings.findOne({name: "pushSettings"})) {
		AdminSettings.insert({
			name: "pushSettings",
			enabled: true
		});
	}

	if (!AdminSettings.findOne({name: "wordcloudPomodoroSettings"})) {
		AdminSettings.insert({
			name: "wordcloudPomodoroSettings",
			enabled: true
		});
	}

	if (!AdminSettings.findOne({name: "testNotifications"})) {
		AdminSettings.insert({
			name: "testNotifications",
			target: undefined
		});
	}

	let cards = Cards.find({lecture: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					lecture: ""
				}
			}
		);
	}

	cards = Cards.find({centerTextElement: {$exists: false}}).fetch();
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

	cards = Cards.find({alignType: {$exists: false}}).fetch();
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

	cards = Cards.find({date: {$exists: false}}).fetch();
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

	cards = Cards.find({learningGoalLevel: {$exists: false}}).fetch();
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

	cards = Cards.find({backgroundStyle: {$exists: false}}).fetch();
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

	cards = Cards.find({originalAuthorName: {$exists: false}}).fetch();
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

	let cardsets = Cardsets.find({wordcloud: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({raterCount: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({editors: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({cardType: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({difficulty: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({shuffled: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({shuffled: true}).fetch();
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

	cardsets = Cardsets.find({originalAuthorName: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({}, {fields: {_id: 1, cardType: 1}}).fetch();
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

	cardsets = Cardsets.find({learningActive: true}, {fields: {_id: 1, name: 1, learningActive: 1}}).fetch();
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

	cardsets = Cardsets.find({shuffled: true}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
	}

	let leitner = Leitner.find({skipped: {$exists: true}}).fetch();
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

	cardsets = Cardsets.find({shuffled: true}, {fields: {_id: 1}}).fetch();
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

	cardsets = Cardsets.find({registrationPeriod: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({pomodoroTimer: {$exists: false}, learningActive: true}).fetch();
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

	cardsets = Cardsets.find({'workload.bonus.count': {$exists: false}}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call('updateLearnerCount', cardsets[i]._id);
	}

	cardsets = Cardsets.find({'workload.bonus.minLearned': {$exists: false}}, {fields: {_id: 1}}).fetch();
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

	cardsets = Cardsets.find({learners: {$exists: true}}, {fields: {_id: 1}}).fetch();
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

	cardsets = Cardsets.find({relevance: {$exists: true}}, {fields: {_id: 1}}).fetch();
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

	cardsets = Cardsets.find({}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call('updateCardsetRating', cardsets[i]._id);
	}

	cardsets = Cardsets.find({sortType: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({lecturerAuthorized: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({transcriptBonus: {$exists: true}}, {fields: {_id: 1, transcriptBonus: 1}}).fetch();
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

	let transcriptBonus = TranscriptBonus.find({deadlineEditing: {$exists: false}}, {fields: {_id: 1, deadline: 1}}).fetch();
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

	transcriptBonus = TranscriptBonus.find({stars: {$exists: false}}, {fields: {_id: 1}}).fetch();
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

	cardsets = Cardsets.find().fetch();
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

	cardsets = Cardsets.find({}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}}).fetch();
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

	cardsets = Cardsets.find({'workload.simulator.errorCount': {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({'transcriptBonus.dates': {$exists: true}}).fetch();
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

	let wozniak;
	wozniak = Wozniak.find({skipped: {$exists: true}}).fetch();
	for (let i = 0; i < wozniak.length; i++) {
		Wozniak.update({
				_id: wozniak[i]._id
			},
			{
				$unset: {
					skipped: ""
				}
			}
		);
	}

	let users = Meteor.users.find({selectedLanguage: {$exists: true}}).fetch();
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

	users = Meteor.users.find({}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < users.length; i++) {
		Meteor.call('updateCardsetCount', users[i]._id);
		Meteor.call('updateTranscriptCount', users[i]._id);
		Meteor.call('updateWorkloadCount', users[i]._id);
	}

	ColorThemes.remove({});
	for (let theme in themes) {
		if (themes.hasOwnProperty(theme)) {
			ColorThemes.insert(themes[theme]);
		}
	}

	Cardsets.remove({_id: testNotificationsCardset[0]._id});
	Cardsets.insert(testNotificationsCardset[0]);

	Meteor.users.remove({_id: testNotificationsUser[0]._id});
	Meteor.users.insert(testNotificationsUser[0]);
	AdminSettings.update({
			name: "testNotifications"
		},
		{
			$set: {
				testCardsetID: testNotificationsCardset[0]._id,
				testUserID: testNotificationsUser[0]._id
			}
		}
	);

	for (let card = 0; card < testNotificationsCards.length; card++) {
		Cards.remove({_id: testNotificationsCards[card]._id});
	}

	for (let learned = 0; learned < testNotificationsLearned.length; learned++) {
		Learned.remove({_id: testNotificationsLearned[learned]._id});
		Leitner.remove({_id: testNotificationsLearned[learned]._id});
	}

	let learned = Learned.find({}).fetch();
	if (learned !== undefined) {
		for (let i = 0; i < learned.length; i++) {
			Leitner.insert({
				card_id: learned[i].card_id,
				cardset_id: learned[i].cardset_id,
				user_id: learned[i].user_id,
				box: learned[i].box,
				nextDate: learned[i].nextDate,
				currentDate: learned[i].currentDate,
				active: learned[i].active
			});
			Wozniak.insert({
				card_id: learned[i].card_id,
				cardset_id: learned[i].cardset_id,
				user_id: learned[i].user_id,
				ef: learned[i].ef,
				reps: learned[i].reps,
				interval: learned[i].interval,
				nextDate: learned[i].nextDate
			});
		}
		Learned.remove({});
	}

	let hiddenUsers = Meteor.users.find({visible: false}).fetch();
	for (let i = 0; i < hiddenUsers.length; i++) {
		if (Cardsets.findOne({owner: hiddenUsers[i]._id, kind: {$ne: "personal"}})) {
			Meteor.users.update(hiddenUsers[i]._id, {
				$set: {
					visible: true
				}
			});
		}
	}

	for (let card = 0; card < testNotificationsCards.length; card++) {
		Cards.insert(testNotificationsCards[card]);
	}

	for (let learned = 0; learned < testNotificationsLearned.length; learned++) {
		Leitner.insert(testNotificationsLearned[learned]);
	}

	cards = Cards.find({cardType: 2}).fetch();
	for (let i = 0; i < cards.length; i++) {
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

	let workload = Workload.find({"leitner.active": {$exists: false}}).fetch();
	for (let i = 0; i < workload.length; i++) {
		LeitnerUtilities.updateLeitnerWorkload(workload[i].cardset_id, workload[i].user_id);
	}

	workload = Workload.find({"leitner.nextLowestPriority": {$exists: false}}).fetch();
	for (let i = 0; i < workload.length; i++) {
		Workload.update({
				user_id: workload[i].user_id,
				cardset_id: workload[i].cardset_id
			},
			{
				$set: {
					"leitner.nextLowestPriority": [-1, -1, -1, -1, -1]
				}
			}
		);
		Leitner.update({
				user_id: workload[i].user_id,
				cardset_id: workload[i].cardset_id
			},
			{
				$set: {
					"priority": 0
				}
			}, {multi: true});
	}

	transcriptBonus = TranscriptBonus.find({"rating": {$exists: false}}).fetch();
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

	Cardsets.remove({cardType: 2});
	Meteor.users.remove(demoCardsetUser[0]._id);
	Meteor.users.insert(demoCardsetUser[0]);
	Meteor.call('deleteDemoCardsets');
	Meteor.call('importDemoCardset', 'demo');
	Meteor.call('importDemoCardset', 'making');
	removeDeletedUsers();
	cronScheduler.startCron();
});
