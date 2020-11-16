// Shared debug commands for the server console
import {CardType} from "../util/cardTypes";

const START_RECORDING = 0;
const END_RECORDING = 1;
const SKIP_RECORDING = 2;
const START_GROUP = 3;
const END_GROUP = 4;
const PROCESS_RECORDING = 5;
const TYPE_INITIALIZE = 0;
const TYPE_MIGRATE = 1;
const TYPE_CLEANUP = 2;

// Default items for the database
let initColorThemes = function () {
	return [{
		"_id": "default",
		"name": "mit Hintergrundbildern"
	}, {
		"_id": "contrast",
		"name": "ohne und mit mehr Kontrast"
	}];
};

let initTestNotificationsCardset = function () {
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
			"noDifficulty": CardType.gotDifficultyLevel(1),
			"useCase": {
				"enabled": false,
				"priority": 0
			}
		}
	];
};

let initTestNotificationsCards = function () {
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

let initTestNotificationsLearned = function () {
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

let initTestNotificationsUser = function () {
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

let initDemoCardsetUser = function () {
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

module.exports = {
	START_RECORDING,
	END_RECORDING,
	SKIP_RECORDING,
	START_GROUP,
	END_GROUP,
	PROCESS_RECORDING,
	TYPE_INITIALIZE,
	TYPE_MIGRATE,
	TYPE_CLEANUP,
	initColorThemes,
	initTestNotificationsCardset,
	initTestNotificationsCards,
	initTestNotificationsLearned,
	initTestNotificationsUser,
	initDemoCardsetUser
};
