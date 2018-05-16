import {Meteor} from "meteor/meteor";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {CourseIterations} from "../../api/courseIterations.js";
import {ColorThemes} from "../../api/theme.js";
import {Learned, Leitner, Wozniak} from "../../api/learned.js";
import {AdminSettings} from "../../api/adminSettings";
import {CronScheduler} from "../../../server/cronjob.js";
import {Ratings} from "../../api/ratings";

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
			"kind": "private",
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
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": false,
			"cardGroups": [],
			"cardType": 0,
			"difficulty": 1
		}
	];
};

var initTestNotificationsCards = function () {
	return [
		{
			"_id": "NotificationsTestCard1",
			"subject": "NotificationsTest: Card Nr. 1",
			"difficulty": 1,
			"front": "Front of NotificationsTest: Card Nr. 1",
			"back": "Back of NotificationsTest: Card Nr. 1",
			"hint": "Hint of NotificationsTest: Card Nr. 1",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 0,
			"backgroundStyle": 0,
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard2",
			"subject": "NotificationsTest: Card Nr. 2",
			"difficulty": 1,
			"front": "Front of NotificationsTest: Card Nr. 2",
			"back": "Back of NotificationsTest: Card Nr. 2",
			"hint": "Hint of NotificationsTest: Card Nr. 2",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 1,
			"backgroundStyle": 0,
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard3",
			"subject": "NotificationsTest: Card Nr. 3",
			"difficulty": 1,
			"front": "Front of NotificationsTest: Card Nr. 3",
			"back": "Back of NotificationsTest: Card Nr. 3",
			"hint": "Hint of NotificationsTest: Card Nr. 3",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 2,
			"backgroundStyle": 0,
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard4",
			"subject": "NotificationsTest: Card Nr. 4",
			"difficulty": 1,
			"front": "Front of NotificationsTest: Card Nr. 4",
			"back": "Back of NotificationsTest: Card Nr. 4",
			"hint": "Hint of NotificationsTest: Card Nr. 4",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 3,
			"backgroundStyle": 0,
			"cardType": 0
		},
		{
			"_id": "NotificationsTestCard5",
			"subject": "NotificationsTest: Card Nr. 5",
			"difficulty": 1,
			"front": "Front of NotificationsTest: Card Nr. 5",
			"back": "Back of NotificationsTest: Card Nr. 5",
			"hint": "Hint of NotificationsTest: Card Nr. 5",
			"cardset_id": "NotificationsTestCardset",
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 4,
			"backgroundStyle": 0,
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
			"isMemo": true,
			"box": 1,
			"ef": 2.5,
			"reps": 0,
			"interval": 0,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date(),
			"skipped": 0
		},
		{
			"_id": "NotificationsTestLearned2",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard2",
			"user_id": "NotificationsTestUser",
			"isMemo": true,
			"box": 1,
			"ef": 2.5,
			"reps": 0,
			"interval": 0,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date(),
			"skipped": 0
		},
		{
			"_id": "NotificationsTestLearned3",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard3",
			"user_id": "NotificationsTestUser",
			"isMemo": true,
			"box": 1,
			"ef": 2.5,
			"reps": 0,
			"interval": 0,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date(),
			"skipped": 0
		},
		{
			"_id": "NotificationsTestLearned4",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard4",
			"user_id": "NotificationsTestUser",
			"isMemo": true,
			"box": 1,
			"ef": 2.5,
			"reps": 0,
			"interval": 0,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date(),
			"skipped": 0
		},
		{
			"_id": "NotificationsTestLearned5",
			"cardset_id": "NotificationsTestCardset",
			"card_id": "NotificationsTestCard5",
			"user_id": "NotificationsTestUser",
			"isMemo": true,
			"box": 1,
			"ef": 2.5,
			"reps": 0,
			"interval": 0,
			"active": true,
			"nextDate": new Date(),
			"currentDate": new Date(),
			"skipped": 0
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
				"givenname": "Standard",
				"completed": true,
				"name": "standardUser",
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

var initDemoCardsets = function () {
	return [
		{
			"_id": "DemoCardset",
			"name": "Demo Cardset",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": ["DemoCardset0", "DemoCardset1", "DemoCardset2", "DemoCardset3", "DemoCardset4", "DemoCardset5", "DemoCardset6"],
			"cardType": 0,
			"difficulty": 1
		},
		{
			"_id": "DemoCardset0",
			"name": "Demo Cardset for card type 0",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 0,
			"difficulty": 0
		},
		{
			"_id": "DemoCardset1",
			"name": "Demo Cardset for card type 1",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 1,
			"difficulty": 0
		},
		{
			"_id": "DemoCardset2",
			"name": "Demo Cardset for card type 2",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 2,
			"difficulty": 0
		},
		{
			"_id": "DemoCardset3",
			"name": "Demo Cardset for card type 3",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 3,
			"difficulty": 0
		},
		{
			"_id": "DemoCardset4",
			"name": "Demo Cardset for card type 4",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 4,
			"difficulty": 0
		},
		{
			"_id": "DemoCardset5",
			"name": "Demo Cardset for card type 5",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 5,
			"difficulty": 0
		},
		{
			"_id": "DemoCardset6",
			"name": "Demo Cardset for card type 6",
			"description": "",
			"date": (new Date().setFullYear(2017, 9, 5)),
			"dateUpdated": (new Date().setFullYear(2017, 9, 5)),
			"owner": ".cards",
			"visible": false,
			"ratings": true,
			"kind": "demo",
			"price": 0,
			"reviewed": false,
			"reviewer": "undefined",
			"request": false,
			"relevance": 0,
			"raterCount": 0,
			"quantity": 0,
			"license": [],
			"userDeleted": false,
			"learningActive": false,
			"maxCards": 0,
			"daysBeforeReset": 0,
			"learningStart": (new Date().setFullYear(2017, 9, 5)),
			"learningEnd": (new Date().setFullYear(2038, 0, 19)),
			"learningInterval": [],
			"wordcloud": false,
			"learners": 0,
			"editors": [],
			"shuffled": true,
			"cardGroups": [],
			"cardType": 6,
			"difficulty": 0
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
	let demoCardsets = initDemoCardsets();

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

	cardsets = Cardsets.find({}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cards.update({
				cardset_id: cardsets[i]._id
			},
			{
				$set: {
					cardType: cardsets[i].cardType,
					difficulty: cardsets[i].difficulty
				}
			},
			{
				multi: true
			}
		);
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

	let courseIterations = CourseIterations.find({price: {$exists: false}}).fetch();
	for (let i = 0; i < courseIterations.length; i++) {
		CourseIterations.update({
				_id: courseIterations[i]._id
			},
			{
				$set: {
					kind: "personal",
					price: Number(0),
					semester: Number(1)
				}
			}
		);
	}

	courseIterations = CourseIterations.find({targetAudience: {$exists: false}}).fetch();
	for (let i = 0; i < courseIterations.length; i++) {
		CourseIterations.update({
				_id: courseIterations[i]._id
			},
			{
				$set: {
					targetAudience: Number(1)
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

	for (let card = 0; card < testNotificationsCards.length; card++) {
		Cards.insert(testNotificationsCards[card]);
	}

	for (let learned = 0; learned < testNotificationsLearned.length; learned++) {
		Leitner.insert(testNotificationsLearned[learned]);
	}

	Meteor.users.remove(demoCardsetUser[0]._id);
	Meteor.users.insert(demoCardsetUser[0]);
	for (let demo = 0; demo < demoCardsets.length; demo++) {
		if (!Cardsets.findOne(demoCardsets[demo]._id)) {
			Cardsets.insert(demoCardsets[demo]);
		}
	}
	cronScheduler.startCron();
});
