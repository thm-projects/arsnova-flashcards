import {Session} from "meteor/session";
import {Cardsets} from "./cardsets";
import {CardType} from "./cardTypes";
import {ServerStyle} from "./styles";

export let Utilities = class Utilities {
	static getCalendarString (type = '', minutes = '', displayMode = 0) {
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
				switch (displayMode) {
					case 1:
						minutes = '[ bis ]' + minutes + '[ Uhr ]';
						break;
					case 2:
						minutes = '[ ab ]' + minutes + '[ Uhr ]';
						break;
					default:
						minutes = '[ ]' + minutes;
						break;
				}
			}
			today = '[Heute]';
			yesterday = '[Gestern]';
			tomorrow = '[Morgen]';
		} else {
			if (minutes !== '') {
				switch (displayMode) {
					case 1:
						minutes = '[ until ]' + minutes;
						break;
					case 2:
						minutes = '[ at ]' + minutes;
						break;
					default:
						minutes = '[ ]' + minutes;
						break;
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

	static getMomentsDate (date, displayMinutes = false, displayMode = 0, transformToSpeech = true) {
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
				sameDay: this.getCalendarString(dateFormat, minutes, displayMode),
				lastDay: this.getCalendarString(dateFormat, minutes, displayMode),
				nextDay: this.getCalendarString(dateFormat, minutes, displayMode),
				nextWeek: this.getCalendarString(dateFormat, minutes, displayMode),
				lastWeek: this.getCalendarString(dateFormat, minutes, displayMode),
				sameElse: this.getCalendarString(dateFormat, minutes, displayMode)
			});
		} else {
			if (displayMode === 0) {
				return moment(date).locale(language).calendar(null, {
					sameDay: this.getCalendarString("today", minutes, displayMode),
					lastDay: this.getCalendarString("yesterday", minutes, displayMode),
					nextDay: this.getCalendarString("nextDay", minutes, displayMode),
					nextWeek: this.getCalendarString(dateFormat, "", displayMode),
					lastWeek: this.getCalendarString(dateFormat, "", displayMode),
					sameElse: this.getCalendarString(dateFormat, "", displayMode)
				});
			} else {
				return moment(date).locale(language).calendar(null, {
					sameDay: this.getCalendarString("today", minutes, displayMode),
					lastDay: this.getCalendarString("yesterday", minutes, displayMode),
					nextDay: this.getCalendarString("nextDay", minutes, displayMode),
					nextWeek: this.getCalendarString(dateFormat, minutes, displayMode),
					lastWeek: this.getCalendarString(dateFormat, minutes, displayMode),
					sameElse: this.getCalendarString(dateFormat, minutes, displayMode)
				});
			}
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
