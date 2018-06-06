import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";

function importCards(data, cardset, importType) {
	if (Meteor.isServer) {
		if (importType === 1) {
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
				if (item.learningGoalLevel === undefined) {
					item.learningGoalLevel = 0;
				}
				if (item.backgroundStyle === undefined) {
					item.backgroundStyle = 0;
				}
				if (item.centerTextElement === undefined) {
					if (cardset.cardType === 1) {
						item.centerTextElement = [true, true, false, false];
					} else {
						item.centerTextElement = [false, false, false, false];
					}
				}

				if (item.date === undefined) {
					item.date = new Date();
				}
			}

			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				let subject, front, back, hint, lecture;
				try {
					// If the string is UTF-8, this will work and not throw an error.
					subject = decodeURIComponent(encodeURIComponent(item.subject));
					front = decodeURIComponent(encodeURIComponent(item.front));
					back = decodeURIComponent(encodeURIComponent(item.back));
					hint = decodeURIComponent(encodeURIComponent(item.hint));
					lecture = decodeURIComponent(encodeURIComponent(item.lecture));
				} catch (e) {
					// If it isn't, an error will be thrown, and we can assume that we have an ISO string.
					subject = item.subject;
					front = item.front;
					back = item.back;
					hint = item.hint;
					lecture = item.lecture;
				}

				let hlcodeReplacement = "\n```\n";
				let regex = /<hlcode>|<\/hlcode>/g;
				front = front.replace(regex, hlcodeReplacement);
				back = back.replace(regex, hlcodeReplacement);

				Cards.insert({
					subject: subject.trim(),
					difficulty: cardset.difficulty,
					front: front,
					back: back,
					hint: hint,
					cardset_id: cardset._id,
					cardGroup: -1,
					cardType: cardset.cardType,
					lecture: lecture,
					centerTextElement: item.centerTextElement,
					learningGoalLevel: item.learningGoalLevel,
					backgroundStyle: item.backgroundStyle,
					learningUnit: item.learningUnit,
					date: item.date,
					dateUpdated: item.dateUpdated
				}, {trimStrings: false});
			}
		} else {
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				Cards.insert({
					subject: item.subject,
					difficulty: cardset.difficulty,
					front: item.front,
					back: item.back,
					hint: item.hint,
					cardset_id: cardset._id,
					cardGroup: -1,
					cardType: cardset.cardType,
					lecture: "",
					centerTextElement: item.centerTextElement,
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
					learningInterval: [],
					learners: 0,
					mailNotification: true,
					webNotification: true,
					wordcloud: false,
					shuffled: false,
					cardGroups: [""],
					cardType: data[0].cardType,
					difficulty: data[0].difficulty,
					originalAuthor: data[0].originalAuthor
				}, {trimStrings: false});
				if (cardset_id) {
					data.shift();
					return importCards(data, Cardsets.findOne(cardset_id), 0);
				} else {
					return false;
				}
			}
		}
	},
	importCards: function (data, cardset_id, importType) {
		if (data[0].name) {
			throw new Meteor.Error(TAPi18n.__('import.failure'));
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
	importDemo: function () {
		if (Meteor.isServer) {
			let oldDemoCardsets = Cardsets.find({kind: 'demo'}, {fields: {_id: 1}}).fetch();
			for (let i = 0; i < oldDemoCardsets.length; i++) {
				Cards.remove({cardset_id: oldDemoCardsets[i]._id});
			}
			Cardsets.remove({kind: 'demo'});
			try {
				let fs = Npm.require("fs");
				let cardGroups = [];
				let demoPath = process.env.PWD + '/private/demo/';
				let doesPathExist = fs.existsSync(demoPath);
				if (!doesPathExist) {
					demoPath = process.env.PWD + '/programs/server/assets/app/demo/';
					doesPathExist = fs.existsSync(demoPath);
				}
				if (doesPathExist) {
					let cardsetFiles = fs.readdirSync(demoPath);
					for (let i = 0; i < cardsetFiles.length; i++) {
						let cardset = JSON.parse('[' + fs.readFileSync(demoPath + cardsetFiles[i], 'utf8') + ']');
						if (cardset[0].name !== undefined) {
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
								quantity: 0,
								license: [],
								userDeleted: false,
								learningActive: false,
								maxCards: 0,
								daysBeforeReset: 0,
								learningStart: 0,
								learningEnd: 0,
								learningInterval: [],
								learners: 0,
								mailNotification: true,
								webNotification: true,
								wordcloud: false,
								shuffled: false,
								cardGroups: [""],
								cardType: cardset[0].cardType,
								difficulty: cardset[0].difficulty,
								originalAuthor: cardset[0].originalAuthor
							}, {trimStrings: false});
							cardGroups.push(cardset_id);
							cardset.shift();
							importCards(cardset, Cardsets.findOne(cardset_id), 0);
						}
					}
				}
				Cardsets.insert({
					name: "DemoCardset",
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
					quantity: 0,
					license: [],
					userDeleted: false,
					learningActive: false,
					maxCards: 0,
					daysBeforeReset: 0,
					learningStart: 0,
					learningEnd: 0,
					learningInterval: [],
					learners: 0,
					mailNotification: true,
					webNotification: true,
					wordcloud: false,
					shuffled: true,
					cardGroups: cardGroups,
					cardType: 0,
					difficulty: 0,
					originalAuthor: ""
				}, {trimStrings: false});
			} catch (error) {
				throw new Meteor.Error(error);
			}
		}
	}
});
