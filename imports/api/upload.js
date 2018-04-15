import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";

Meteor.methods({
	parseUpload: function (data, cardset_id, importType) {
		check(cardset_id, String);
		check(importType, Number);
		var cardset = Cardsets.findOne(cardset_id);
		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}

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
				if (item.difficulty === undefined) {
					item.difficulty = Number(0);
				}
				if (item.cardType === undefined) {
					item.cardType = Number(0);
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
					if (item.cardType === 1) {
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

				let subject, front, back, hint, cardType, lecture;
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
					cardType = item.cardType;
					lecture = item.lecture;
				}

				let hlcodeReplacement = "\n```\n";
				let regex = /<hlcode>|<\/hlcode>/g;
				front = front.replace(regex, hlcodeReplacement);
				back = back.replace(regex, hlcodeReplacement);

				Cards.insert({
					subject: subject,
					difficulty: item.difficulty,
					front: front,
					back: back,
					hint: hint,
					cardset_id: cardset_id,
					cardGroup: -1,
					cardType: item.cardType,
					lecture: lecture,
					centerTextElement: item.centerTextElement,
					learningGoalLevel: item.learningGoalLevel,
					backgroundStyle: item.backgroundStyle,
					learningUnit: item.learningUnit
				});
			}
		} else {
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				console.log(item[0]);
				Cards.insert({
					subject: TAPi18n.__('upload-card-title-placeholder'),
					difficulty: 0,
					front: item[0],
					back: item[1],
					hint: "",
					cardset_id: cardset_id,
					cardGroup: -1,
					cardType: 2,
					lecture: "",
					centerTextElement: [true, true, false, false],
					learningGoalLevel: 0,
					backgroundStyle: 0
				});
			}
		}
		Cardsets.update(cardset_id, {
			$set: {
				quantity: Cards.find({cardset_id: cardset_id}).count()
			}
		});
	}
});
