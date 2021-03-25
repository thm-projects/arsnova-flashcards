import {Meteor} from "meteor/meteor";
import {Cards} from "../api/subscriptions/cards";
import {Cardsets} from "../api/subscriptions/cardsets";
import {CardType} from "./cardTypes";

export function importCards(data, cardset, importType) {
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
			if (item.lastEditor === undefined) {
				item.lastEditor = "";
			}

			if (item.learningTime === undefined) {
				item.learningTime = {
					initial: -1,
					repeated: -1
				};
			}
			if (importType === 1) {
				let cardItem = data[i];
				let subject, front, back, hint, lecture, top, bottom, lastEditor;
				try {
					// If the string is UTF-8, this will work and not throw an error.
					subject = decodeURIComponent(encodeURIComponent(cardItem.subject));
					front = decodeURIComponent(encodeURIComponent(cardItem.front));
					back = decodeURIComponent(encodeURIComponent(cardItem.back));
					hint = decodeURIComponent(encodeURIComponent(cardItem.hint));
					lecture = decodeURIComponent(encodeURIComponent(cardItem.lecture));
					top = decodeURIComponent(encodeURIComponent(cardItem.top));
					bottom = decodeURIComponent(encodeURIComponent(cardItem.bottom));
					lastEditor = decodeURIComponent(encodeURIComponent(cardItem.lastEditor));
				} catch (e) {
					// If it isn't, an error will be thrown, and we can assume that we have an ISO string.
					subject = cardItem.subject;
					front = cardItem.front;
					back = cardItem.back;
					hint = cardItem.hint;
					lecture = cardItem.lecture;
					top = cardItem.top;
					bottom = cardItem.bottom;
					lastEditor = cardItem.lastEditor;
				}

				let hlcodeReplacement = "\n```\n";
				let regex = /<hlcode>|<\/hlcode>/g;
				front = front.replace(regex, hlcodeReplacement);
				back = back.replace(regex, hlcodeReplacement);
				let originalAuthorName;
				if (cardItem.originalAuthor !== undefined) {
					originalAuthorName = {
						legacyName: cardItem.originalAuthor
					};
				} else {
					originalAuthorName = cardItem.originalAuthorName;
				}
				if (cardItem.learningTime === undefined) {
					cardItem.learningTime = {
						initial: -1,
						repeated: -1
					};
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
					centerTextElement: cardItem.centerTextElement,
					alignType: cardItem.alignType,
					learningGoalLevel: cardItem.learningGoalLevel,
					backgroundStyle: cardItem.backgroundStyle,
					date: cardItem.date,
					dateUpdated: cardItem.dateUpdated,
					originalAuthorName: originalAuthorName,
					owner: cardset.owner,
					cardType: cardset.cardType,
					lastEditor: lastEditor,
					learningTime: cardItem.learningTime,
					answers: cardItem.answers
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
					dateUpdated: item.dateUpdated,
					owner: cardset.owner,
					cardType: cardset.cardType,
					lastEditor: item.lastEditor,
					learningTime: item.learningTime,
					answers: item.answers
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
		if (CardType.getCardTypesWithLearningModes().findIndex(elem => elem === cardset.cardType) >= 0) {
			Meteor.call("updateCurrentBonusPoints", cardset._id);
			Cardsets.find({
				learningActive: true,
				cardGroups: cardset._id
			}).forEach(cardsetElem => Meteor.call("updateCurrentBonusPoints", cardsetElem._id));
		}
		return cardset._id;
	}
}
