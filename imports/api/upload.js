import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";

Meteor.methods({
	parseUpload: function (data, cardset_id) {
		check(cardset_id, String);
		var cardset = Cardsets.findOne(cardset_id);
		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}

		for (let i = 0; i < data.length; i++) {
			let item = data[i];

			if (item.front === undefined || item.front === "") {
				throw new Meteor.Error("entry number: " + i, "front missing");
			} else if (item.back === undefined || item.back === "") {
				throw new Meteor.Error("entry number: " + i, "back missing");
			}
			if (item.subject === undefined) {
				item.subject = "Kein Titel";
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

			if (item.centerText === undefined) {
				item.centerText = false;
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

			if (item.front !== "") {
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
					centerText: item.centerText
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
