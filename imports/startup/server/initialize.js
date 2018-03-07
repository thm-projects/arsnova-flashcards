import {Meteor} from "meteor/meteor";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {ColorThemes} from "../../api/theme.js";
import {Learned, Leitner, Wozniak} from "../../api/learned.js";
import {AdminSettings} from "../../api/adminSettings";
import {CronScheduler} from "../../../server/cronjob.js";
import {Ratings} from "../../api/ratings";

var initColorThemes = function () {
	return [{
		"_id": "default",
		"name": "Default"
	}, {
		"_id": "contrast",
		"name": "Contrast"
	}];
};

var initTestNotificationsCardset = function () {
	return [
		{
			"_id": "NotificationsTestCardset",
			"name": "Notifications Test",
			"description": "This cardset tests the E-Mail and web notifications of THM.cards.",
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
			"moduleActive": true,
			"module": "Notifications Test",
			"moduleToken": "NT",
			"moduleNum": "CS1024",
			"college": "THM",
			"course": "BA-Informatik",
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
			"cardGroups": []
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
			"cardGroup": "0",
			"cardType": 0,
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 0,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard2",
			"subject": "NotificationsTest: Card Nr. 2",
			"difficulty": 2,
			"front": "Front of NotificationsTest: Card Nr. 2",
			"back": "Back of NotificationsTest: Card Nr. 2",
			"hint": "Hint of NotificationsTest: Card Nr. 2",
			"cardset_id": "NotificationsTestCardset",
			"cardGroup": "0",
			"cardType": 0,
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 1,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard3",
			"subject": "NotificationsTest: Card Nr. 3",
			"difficulty": 0,
			"front": "Front of NotificationsTest: Card Nr. 3",
			"back": "Back of NotificationsTest: Card Nr. 3",
			"hint": "Hint of NotificationsTest: Card Nr. 3",
			"cardset_id": "NotificationsTestCardset",
			"cardGroup": "0",
			"cardType": 0,
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 2,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard4",
			"subject": "NotificationsTest: Card Nr. 4",
			"difficulty": 2,
			"front": "Front of NotificationsTest: Card Nr. 4",
			"back": "Back of NotificationsTest: Card Nr. 4",
			"hint": "Hint of NotificationsTest: Card Nr. 4",
			"cardset_id": "NotificationsTestCardset",
			"cardGroup": "0",
			"cardType": 0,
			"lecture": "",
			"centerTextElement": [false, false, false, false],
			"learningGoalLevel": 3,
			"backgroundStyle": 0
		},
		{
			"_id": "NotificationsTestCard5",
			"subject": "NotificationsTest: Card Nr. 5",
			"difficulty": 0,
			"front": "Front of NotificationsTest: Card Nr. 5",
			"back": "Back of NotificationsTest: Card Nr. 5",
			"hint": "Hint of NotificationsTest: Card Nr. 5",
			"cardset_id": "NotificationsTestCardset",
			"cardGroup": "0",
			"cardType": 0,
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
							"hashedToken": ""
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

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();
	let themes = initColorThemes();
	let testNotificationsCardset = initTestNotificationsCardset();
	let testNotificationsCards = initTestNotificationsCards();
	let testNotificationsLearned = initTestNotificationsLearned();
	let testNotificationsUser = initTestNotificationsUser();

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

	let cards = Cards.find({difficulty: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					difficulty: 0
				}
			}
		);
	}

	cards = Cards.find({cardType: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					cardType: 0
				}
			}
		);
	}

	cards = Cards.find({lecture: {$exists: false}}).fetch();
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

	cards = Cards.find({cardType: 3}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					cardType: 2
				}
			}
		);
	}

	cards = Cards.find({centerTextElement: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		let centerTextElement;
		if (cards[i].cardType === 2) {
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

	cards = Cards.find({difficulty: 0, cardType: {$ne: 2}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					difficulty: 1
				}
			}
		);
	}

	let cardsets = Cardsets.find({moduleLink: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					moduleLink: ""
				}
			}
		);
	}

	cardsets = Cardsets.find({wordcloud: {$exists: false}}).fetch();
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

	cardsets = Cardsets.find({moduleActive: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					moduleActive: true
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

	cardsets = Cardsets.find({college: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					college: Meteor.settings.public.university.default
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
		Cards.update({
				cardset_id: cardsets[i]._id
			},
			{
				$set: {
					cardGroup: "0"
				}
			},
			{
				multi: true
			});
	}

	let leitner = Leitner.find({skipped: {$exists: false}}).fetch();
	for (let i = 0; i < leitner.length; i++) {
		Leitner.update({
				_id: leitner[i]._id
			},
			{
				$set: {
					skipped: 0
				}
			}
		);
	}

	let wozniak = Wozniak.find({skipped: {$exists: false}}).fetch();
	for (let i = 0; i < wozniak.length; i++) {
		Wozniak.update({
				_id: wozniak[i]._id
			},
			{
				$set: {
					skipped: 0
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

	Meteor.call("updateWordsForWordcloud");
	cronScheduler.startCron();
	cronScheduler.startWordCron();
});
