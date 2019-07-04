import {Session} from "meteor/session";
import {Cardsets} from "./cardsets";
import {CardType} from "./cardTypes";
import {ServerStyle} from "./styles";

export let Utilities = class Utilities {
	static getCalendarString (type = '', minutes = '', displayAsDeadline = false) {
		let today = '[Today]';
		let yesterday = '[Yesterday]';
		let tomorrow = '[Tomorrow]';
		let language;
		if (Meteor.isServer) {
			language = ServerStyle.getServerLanguage();
		} else {
			language = Session.get('activeLanguage');
		}
		if (language === 'de') {
			if (minutes !== '') {
				if (displayAsDeadline) {
					minutes = '[ bis ]' + minutes + '[ Uhr ]';
				} else {
					minutes = '[ ]' + minutes;
				}
			}
			today = '[Heute]';
			yesterday = '[Gestern]';
			tomorrow = '[Morgen]';
		} else {
			if (minutes !== '') {
				if (displayAsDeadline) {
					minutes = '[ until ]' + minutes;
				} else {
					minutes = '[ ]' + minutes;
				}
			}
		}
		switch (type) {
			case "today":
				return today + minutes;
			case "yesterday":
				return yesterday + minutes;
			case "nextDay":
				return tomorrow + minutes;
			default:
				return type + minutes;
		}
	}

	static getMomentsDate (date, displayMinutes = false, displayAsDeadline = false, transformToSpeech = true) {
		let minutes = "";
		let dateFormat = "D. MMMM YYYY";
		if (displayMinutes === true) {
			dateFormat = "D. MMM YY " + minutes;
			minutes = "H:mm";
		}
		let language;
		if (Meteor.isServer) {
			language = ServerStyle.getServerLanguage();
		} else {
			language = Session.get('activeLanguage');
		}
		if (!transformToSpeech) {
			dateFormat = "DD";
			return moment(date).locale(language).calendar(null, {
				sameDay: dateFormat,
				lastDay: dateFormat,
				nextDay: dateFormat,
				nextWeek: dateFormat,
				lastWeek: dateFormat,
				sameElse: dateFormat
			});
		}
		if (displayAsDeadline) {
			return moment(date).locale(language).calendar(null, {
				sameDay: this.getCalendarString("today", minutes, displayAsDeadline),
				lastDay: this.getCalendarString("yesterday", minutes, displayAsDeadline),
				nextDay: this.getCalendarString("nextDay", minutes, displayAsDeadline),
				nextWeek: this.getCalendarString(dateFormat, minutes, displayAsDeadline),
				lastWeek: this.getCalendarString(dateFormat, minutes, displayAsDeadline),
				sameElse: this.getCalendarString(dateFormat, minutes, displayAsDeadline)
			});
		} else {
			return moment(date).locale(language).calendar(null, {
				sameDay: this.getCalendarString("today", minutes),
				lastDay: this.getCalendarString("yesterday", minutes),
				nextDay: this.getCalendarString("nextDay", minutes),
				nextWeek: dateFormat,
				lastWeek: dateFormat,
				sameElse: dateFormat
			});
		}
	}

	static getMomentsTime (date) {
		return moment(date).format("H:mm");
	}

	static getMomentsDateShort (date) {
		let language;
		if (Meteor.isServer) {
			language = ServerStyle.getServerLanguage();
		} else {
			language = Session.get('activeLanguage');
		}
		return moment(date).locale(language).calendar(null, {
			sameDay: this.getCalendarString("today"),
			lastDay: this.getCalendarString("yesterday"),
			nextWeek: 'D.MMM YY',
			lastWeek: 'D.MMM YY',
			sameElse: 'D.MMM YY'
		});
	}

	static getUniqData (data, key) {
		let distinctArray = _.uniq(data, false, function (item) {
			return item[key];
		});
		return _.pluck(distinctArray, key);
	}

	static checkIfRepGotWorkloadCardset (rep) {
		for (let c = 0; c < rep.cardGroups.length; c++) {
			let cardset = Cardsets.findOne({_id: rep.cardGroups[c]}, {fields: {cardType: 1}});
			if (cardset !== undefined) {
				if (CardType.getCardTypesWithLearningModes().includes(cardset.cardType)) {
					return true;
				}
			}
		}
	}
};
