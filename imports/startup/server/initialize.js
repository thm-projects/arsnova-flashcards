import {Meteor} from "meteor/meteor";
import {Badges} from "../../api/badges.js";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {ColorThemes} from "../../api/theme.js";
import {Learned, Leitner, Wozniak} from "../../api/learned.js";
import {AdminSettings} from "../../api/adminSettings";
import {CronScheduler} from "../../../server/cronjob.js";

var initColorThemes = function () {
	return [{
		"_id": "default",
		"name": "Default"
	}, {
		"_id": "aflatunense",
		"name": "Aflatunense"
	}, {
		"_id": "lemonchill",
		"name": "Lemon Chill"
	}, {
		"_id": "bluestar",
		"name": "Blue Star"
	}];
};

var initBadges = function () {
	return [{
		"_id": "1",
		"name": "Reviewer",
		"desc": "Criticism is the highest form of affection. Users will be rewarded with this badge if they deal with cardsets of others and give constructive feedback.",
		"rank1": 50,
		"rank2": 25,
		"rank3": 10,
		"unit": "ratings",
		"badge": "kritiker",
		"i18n": {
			"de": {
				"name": "Kritiker",
				"desc": "Kritik ist die höchste Form der Zuneigung. Benutzer, welche sich sachlich mit den Kartensätzen anderer auseinandersetzen und konstruktives Feedback oder Lob aussprechen, werden mit diesem Badge belohnt",
				"unit": "Bewertungen"
			}
		}
	}, {
		"_id": "2",
		"name": "Reviewer's favourite",
		"desc": "You will obtain this badge by earning good feedback of other users. It contains all your public cardsets with at least 5 reviews with an average rating of 4.5 stars.",
		"rank1": 30,
		"rank2": 15,
		"rank3": 5,
		"unit": "carddecks",
		"badge": "krone",
		"i18n": {
			"de": {
				"name": "Liebling der Kritiker",
				"desc": "Du erhältst diesen Badge, wenn deine Kartensätze von anderen Lernenden gut bewertet werden. Als Kartensatz zählen alle deine öffentlichen Kartensätze mit mindestens 5 Bewertungen bei einer durchschnittlichen Bewertung von 4,5 Sternen.",
				"unit": "Kartensätze"
			}
		}
	}, {
		"_id": "3",
		"name": "Patron",
		"desc": "Visit THMcards for several days to obtain this badge!",
		"rank1": 50,
		"rank2": 25,
		"rank3": 10,
		"unit": "days",
		"badge": "stammgast",
		"i18n": {
			"de": {
				"name": "Stammgast",
				"desc": "Besuche THMcards mehrere Tage und erhalte den Stammgast Badge!",
				"unit": "Tage"
			}
		}
	}, {
		"_id": "4",
		"name": "Nerd",
		"desc": "Ambitiousness is rewarded. Learn different cardsets to obtain this badge. It doesn't matter which learning method you use.",
		"rank1": 30,
		"rank2": 15,
		"rank3": 5,
		"unit": "cardsets",
		"badge": "streber",
		"i18n": {
			"de": {
				"name": "Streber",
				"desc": "Strebsamkeit wird belohnt. Lerne unterschiedliche Kartensätze um diesen Badge zu erhalten. Es steht dir frei, welche Lernmethode du wählst.",
				"unit": "Kartensätze"
			}
		}
	}, {
		"_id": "5",
		"name": "Benefactor",
		"desc": "Create a certain number of public cardsets that contain at least 5 cards.",
		"rank1": 15,
		"rank2": 10,
		"rank3": 5,
		"unit": "cardsets",
		"badge": "autor",
		"i18n": {
			"de": {
				"name": "Wohltäter",
				"desc": "Erstelle eine bestimmte Anzahl an öffentlichen Kartensätzen, die mindestens 5 Karten beinhalten.",
				"unit": "Kartensätze"
			}
		}
	}, {
		"_id": "6",
		"name": "Bestselling author",
		"desc": "Reach many learners with popular cardsets.",
		"rank1": 40,
		"rank2": 20,
		"rank3": 10,
		"unit": "learner",
		"badge": "bestseller",
		"i18n": {
			"de": {
				"name": "Bestseller-Autor",
				"desc": "Erreiche viele Lernende mithilfe beliebter Kartensätze.",
				"unit": "Lernende"
			}
		}
	}];
};

var initTestNotificationsCardset = function () {
	return [
		{
			"_id": "NotificationsTestCardset",
			"name": "Notifications Test",
			"description": "This cardset tests the E-Mail and web notifications of THMCards.",
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
			"quantity": 5,
			"license": [
				"by",
				"nc",
				"nd"
			],
			"userDeleted": false,
			"module": "Notifications Test",
			"moduleToken": "NT",
			"moduleNum": "CS1024",
			"skillLevel": 1,
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
			"lecture": ""
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
			"lecture": ""
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
			"lecture": ""
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
			"lecture": ""
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
			"lecture": ""
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
			"currentDate": new Date()
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
			"currentDate": new Date()
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
			"currentDate": new Date()
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
			"currentDate": new Date()
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
			"earnedBadges": [
				{
					"index": "5",
					"rank": "3"
				}
			],
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
	let badges = initBadges();
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

	let cardsets = Cardsets.find({skillLevel: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					skillLevel: 0
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

	if (Badges.find().count() === 0) {
		for (let badge in badges) {
			if (badges.hasOwnProperty(badge)) {
				Badges.insert(badges[badge]);
			}
		}
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
