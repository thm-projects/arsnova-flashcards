import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";
import {CardType} from "./cardTypes";

function importCards(data, cardset, importType) {
	if (Meteor.isServer) {
		for (let i = 0; i < data.length; i++) {
			let item = data[i];

			if (item.subject === undefined) {
				item.subject = "Kein Titel";
			}
			if (item.front === undefined) {
				item.front = "";
			}
			if (item.back === undefined) {
				item.back = "";
			}
			if (item.hint === undefined) {
				item.hint = "";
			}
			if (item.lecture === undefined) {
				item.lecture = "";
			}
			if (item.top === undefined) {
				item.top = "";
			}
			if (item.bottom === undefined) {
				item.bottom = "";
			}
			if (item.learningGoalLevel === undefined) {
				item.learningGoalLevel = 0;
			}
			if (item.backgroundStyle === undefined) {
				item.backgroundStyle = 0;
			}
			if (item.centerTextElement === undefined) {
				if (cardset.cardType === 1) {
					item.centerTextElement = [true, true, false, false, false, false];
				} else {
					item.centerTextElement = [false, false, false, false, false, false];
				}
			}
			if (item.alignType === undefined) {
				item.alignType = [1, 1, 1, 1, 1, 1];
			}
			if (item.date === undefined) {
				item.date = new Date();
			}

			if (importType === 1) {
				let item = data[i];
				let subject, front, back, hint, lecture, top, bottom;
				try {
					// If the string is UTF-8, this will work and not throw an error.
					subject = decodeURIComponent(encodeURIComponent(item.subject));
					front = decodeURIComponent(encodeURIComponent(item.front));
					back = decodeURIComponent(encodeURIComponent(item.back));
					hint = decodeURIComponent(encodeURIComponent(item.hint));
					lecture = decodeURIComponent(encodeURIComponent(item.lecture));
					top = decodeURIComponent(encodeURIComponent(item.top));
					bottom = decodeURIComponent(encodeURIComponent(item.bottom));
				} catch (e) {
					// If it isn't, an error will be thrown, and we can assume that we have an ISO string.
					subject = item.subject;
					front = item.front;
					back = item.back;
					hint = item.hint;
					lecture = item.lecture;
					top = item.top;
					bottom = item.bottom;
				}

				let hlcodeReplacement = "\n```\n";
				let regex = /<hlcode>|<\/hlcode>/g;
				front = front.replace(regex, hlcodeReplacement);
				back = back.replace(regex, hlcodeReplacement);
				let originalAuthorName;
				if (item.originalAuthor !== undefined) {
					originalAuthorName = {
						legacyName: item.originalAuthor
					};
				} else {
					originalAuthorName = item.originalAuthorName;
				}
				Cards.insert({
					subject: subject.trim(),
					front: front,
					back: back,
					hint: hint,
					cardset_id: cardset._id,
					cardGroup: -1,
					lecture: lecture,
					top: top,
					bottom: bottom,
					centerTextElement: item.centerTextElement,
					alignType: item.alignType,
					learningGoalLevel: item.learningGoalLevel,
					backgroundStyle: item.backgroundStyle,
					learningUnit: item.learningUnit,
					date: item.date,
					dateUpdated: item.dateUpdated,
					originalAuthorName: originalAuthorName
				}, {trimStrings: false});
			} else {
				Cards.insert({
					subject: item.subject,
					front: item.front,
					back: item.back,
					hint: item.hint,
					cardset_id: cardset._id,
					cardGroup: -1,
					lecture: item.lecture,
					top: item.top,
					bottom: item.bottom,
					centerTextElement: item.centerTextElement,
					alignType: item.alignType,
					learningGoalLevel: item.learningGoalLevel,
					backgroundStyle: item.backgroundStyle,
					originalAuthor: item.originalAuthor,
					date: item.date,
					dateUpdated: item.dateUpdated
				}, {trimStrings: false});
			}
		}
		Cardsets.update(cardset._id, {
			$set: {
				quantity: Cards.find({cardset_id: cardset._id}).count()
			}
		});
		Meteor.call('updateShuffledCardsetQuantity', cardset._id);
		let cardsets = Cardsets.find({
			$or: [
				{_id: cardset._id},
				{cardGroups: {$in: [cardset._id]}}
			]
		}, {fields: {_id: 1}}).fetch();
		for (let i = 0; i < cardsets.length; i++) {
			Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
		}
		return cardset._id;
	}
}

Meteor.methods({
	importCardset: function (data) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (!data[0].name) {
				throw new Meteor.Error(TAPi18n.__('import.failure'));
			} else {
				let originalAuthorName;
				if (data[0].originalAuthor !== undefined) {
					originalAuthorName = {
						legacyName: data[0].originalAuthor
					};
				} else {
					originalAuthorName = data[0].originalAuthorName;
				}
				let cardset_id = Cardsets.insert({
					name: data[0].name,
					description: data[0].description,
					date: data[0].date,
					dateUpdated: data[0].dateUpdated,
					editors: [],
					owner: Meteor.userId(),
					visible: false,
					ratings: true,
					kind: "personal",
					price: 0,
					reviewed: false,
					reviewer: 'undefined',
					request: false,
					relevance: 0,
					raterCount: 0,
					quantity: data[0].quantity,
					license: [],
					userDeleted: false,
					learningActive: false,
					maxCards: 0,
					daysBeforeReset: 0,
					learningStart: 0,
					learningEnd: 0,
					registrationPeriod: 0,
					learningInterval: [],
					mailNotification: true,
					webNotification: true,
					wordcloud: false,
					shuffled: false,
					cardGroups: [""],
					cardType: data[0].cardType,
					difficulty: data[0].difficulty,
					noDifficulty: CardType.gotDifficultyLevel(data[0].cardType),
					originalAuthorName: originalAuthorName
				}, {trimStrings: false});
				if (cardset_id) {
					data.shift();
					Meteor.call('updateLearnerCount', cardset_id);
					return importCards(data, Cardsets.findOne(cardset_id), 0);
				} else {
					return false;
				}
			}
		}
	},
	importCards: function (data, cardset_id, importType) {
		if (data[0].name) {
			data.shift();
		}
		check(cardset_id, String);
		check(importType, Number);
		let cardset = Cardsets.findOne(cardset_id);
		if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		} else {
			return importCards(data, cardset, importType);
		}
	},
	deleteDemoCardsets: function () {
		if (Meteor.isServer) {
			let oldDemoCardsets = Cardsets.find({kind: 'demo'}, {fields: {_id: 1}}).fetch();
			for (let i = 0; i < oldDemoCardsets.length; i++) {
				Cards.remove({cardset_id: oldDemoCardsets[i]._id});
			}
			Cardsets.remove({kind: 'demo'});
		}
	},
	importDemoCardset: function (type) {
		if (Meteor.isServer) {
			let demoPath;
			let demoCardsetName;
			if (type === 'demo') {
				demoCardsetName = 'DemoCardset';
			} else {
				demoCardsetName = 'MakingOfCardset';
			}
			try {
				let fs = Npm.require("fs");
				let cardGroups = [];
				let totalQuantity = 0;
				if (type === 'demo') {
					demoPath = process.env.PWD + '/private/demo/';
				} else {
					demoPath = process.env.PWD + '/private/makingOf/';
				}
				let doesPathExist = fs.existsSync(demoPath);
				if (!doesPathExist) {
					if (type === 'demo') {
						demoPath = process.env.PWD + '/programs/server/assets/app/demo/';
					} else {
						demoPath = process.env.PWD + '/programs/server/assets/app/makingOf/';
					}
					doesPathExist = fs.existsSync(demoPath);
				}
				if (doesPathExist) {
					let cardsetFiles = fs.readdirSync(demoPath);
					let originalAuthorName;
					for (let i = 0; i < cardsetFiles.length; i++) {
						let cardset;
						let res = fs.readFileSync(demoPath + cardsetFiles[i], 'utf8');
						if (res.charAt(0) === '[' && res.charAt(res.length - 1) === ']') {
							cardset = JSON.parse(res);
						} else {
							cardset = JSON.parse('[' + res + ']');
						}
						if (cardset[0].originalAuthor !== undefined) {
							originalAuthorName = {
								legacyName: cardset[0].originalAuthor
							};
						} else {
							originalAuthorName = cardset[0].originalAuthorName;
						}
						if (cardset[0].name !== undefined) {
							totalQuantity += cardset[0].quantity;
							let cardset_id = Cardsets.insert({
								name: cardset[0].name,
								description: cardset[0].description,
								date: cardset[0].date,
								dateUpdated: cardset[0].dateUpdated,
								editors: [],
								owner: ".cards",
								visible: true,
								ratings: false,
								kind: "demo",
								price: 0,
								reviewed: false,
								reviewer: 'undefined',
								request: false,
								relevance: 0,
								raterCount: 0,
								quantity: cardset[0].quantity,
								license: [],
								userDeleted: false,
								learningActive: false,
								maxCards: 0,
								daysBeforeReset: 0,
								learningStart: 0,
								learningEnd: 0,
								registrationPeriod: 0,
								learningInterval: [],
								mailNotification: true,
								webNotification: true,
								wordcloud: false,
								shuffled: false,
								cardGroups: [""],
								cardType: cardset[0].cardType,
								difficulty: cardset[0].difficulty,
								noDifficulty: CardType.gotDifficultyLevel(cardset[0].cardType),
								originalAuthorName: originalAuthorName
							}, {trimStrings: false});
							cardGroups.push(cardset_id);
							cardset.shift();
							Meteor.call('updateLearnerCount', cardset_id);
							importCards(cardset, Cardsets.findOne(cardset_id), 0);
						}
					}
				}
				Cardsets.insert({
					name: demoCardsetName,
					description: "",
					date: new Date(),
					dateUpdated: new Date(),
					editors: [],
					owner: ".cards",
					visible: true,
					ratings: false,
					kind: "demo",
					price: 0,
					reviewed: false,
					reviewer: 'undefined',
					request: false,
					relevance: 0,
					raterCount: 0,
					quantity: totalQuantity,
					license: [],
					userDeleted: false,
					learningActive: false,
					maxCards: 0,
					daysBeforeReset: 0,
					learningStart: 0,
					learningEnd: 0,
					registrationPeriod: 0,
					learningInterval: [],
					mailNotification: true,
					webNotification: true,
					wordcloud: false,
					shuffled: true,
					cardGroups: cardGroups,
					cardType: 0,
					difficulty: 0,
					noDifficulty: CardType.gotDifficultyLevel(0),
					originalAuthorName: ""
				}, {trimStrings: false});
			} catch (error) {
				throw new Meteor.Error(error);
			}
		}
	}
});
