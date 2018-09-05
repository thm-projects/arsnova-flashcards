import {Meteor} from "meteor/meteor";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {ColorThemes} from "../../api/theme.js";
import {Learned, Leitner, Wozniak} from "../../api/learned.js";
import {AdminSettings} from "../../api/adminSettings";
import {CronScheduler} from "../../../server/cronjob.js";
import {Ratings} from "../../api/ratings";
import {CardType} from "../../api/cardTypes";

var initColorThemes = function () {
	return [{
		"_id": "default",
		"name": "Foto aus Wikipedia zum Thema \"Zettelkasten\" von Kai Schreiber, CC BY-SA 2.0"
	}, {
		"_id": "contrast",
		"name": "Ohne Hintergrundbild und mit mehr Kontrast"
	}];
};

var initTestNotificationsCardset = function () {
	return [
		{
			"_id": "NotificationsTestCardset",
			"name": "Notifications Test",
			"description": "This cardset tests the E-Mail and web notifications of .cards.",
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
			"relevance": 0,
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
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"registrationPeriod": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
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
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 0,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard2",
			"subject": "NotificationsTest: Card Nr. 2",
			"front": "Front of NotificationsTest: Card Nr. 2",
			"back": "Back of NotificationsTest: Card Nr. 2",
			"hint": "Hint of NotificationsTest: Card Nr. 2",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 1,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard3",
			"subject": "NotificationsTest: Card Nr. 3",
			"front": "Front of NotificationsTest: Card Nr. 3",
			"back": "Back of NotificationsTest: Card Nr. 3",
			"hint": "Hint of NotificationsTest: Card Nr. 3",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 2,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard4",
			"subject": "NotificationsTest: Card Nr. 4",
			"front": "Front of NotificationsTest: Card Nr. 4",
			"back": "Back of NotificationsTest: Card Nr. 4",
			"hint": "Hint of NotificationsTest: Card Nr. 4",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 3,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard5",
			"subject": "NotificationsTest: Card Nr. 5",
			"front": "Front of NotificationsTest: Card Nr. 5",
			"back": "Back of NotificationsTest: Card Nr. 5",
			"hint": "Hint of NotificationsTest: Card Nr. 5",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 4,
			"backgroundStyle": 0
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

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();
	let themes = initColorThemes();
	let testNotificationsCardset = initTestNotificationsCardset();
	let testNotificationsCards = initTestNotificationsCards();
	let testNotificationsLearned = initTestNotificationsLearned();
	let testNotificationsUser = initTestNotificationsUser();
	let demoCardsetUser = initDemoCardsetUser();

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
		let centerTextElement;
		if (Cardsets.findOne({_id: cards[i].cardset_id}).cardType === 2) {
			centerTextElement = [true, true, false, false];
		} else {
			centerTextElement = [false, false, false, false];
		}
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					centerTextElement: centerTextElement
				},
				$unset: {
					centerText: 1
				}
			}
		);
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

	cards = Cards.find({learningIndex: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					learningIndex: 0
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

	cardsets = Cardsets.find({learners: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call("updateLearnerCount", cardsets[i]._id);
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
		leitner = Leitner.find({cardset_id: cardsets[i]._id, original_cardset_id: {$exists: false}}, {fields: {_id: 1, card_id: 1}}).fetch();
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

	cardsets = Cardsets.find({registrationPeriod:  {$exists: false}}).fetch();
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

	let wozniak = Wozniak.find({skipped: {$exists: true}}).fetch();
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

	Meteor.users.remove(demoCardsetUser[0]._id);
	Meteor.users.insert(demoCardsetUser[0]);
	Meteor.call('deleteDemoCardsets');
	Meteor.call('importDemoCardset', 'demo');
	Meteor.call('importDemoCardset', 'making');
	cronScheduler.startCron();
});
