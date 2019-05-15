import {Session} from "meteor/session";

export let Utilities = class Utilities {
	static getCalendarString (type = '', minutes = '', displayAsDeadline = false) {
		let today = '[Today]';
		let yesterday = '[Yesterday]';
		let tomorrow = '[Tomorrow]';
		if (Session.get('activeLanguage') === 'de') {
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
		if (!transformToSpeech) {
			dateFormat = "DD";
			return moment(date).locale(Session.get('activeLanguage')).calendar(null, {
				sameDay: dateFormat,
				lastDay: dateFormat,
				nextDay: dateFormat,
				nextWeek: dateFormat,
				lastWeek: dateFormat,
				sameElse: dateFormat
			});
		}
		if (displayAsDeadline) {
			return moment(date).locale(Session.get('activeLanguage')).calendar(null, {
				sameDay: this.getCalendarString("today", minutes, displayAsDeadline),
				lastDay: this.getCalendarString("yesterday", minutes, displayAsDeadline),
				nextDay: this.getCalendarString("nextDay", minutes, displayAsDeadline),
				nextWeek: this.getCalendarString(dateFormat, minutes, displayAsDeadline),
				lastWeek: this.getCalendarString(dateFormat, minutes, displayAsDeadline),
				sameElse: this.getCalendarString(dateFormat, minutes, displayAsDeadline)
			});
		} else {
			return moment(date).locale(Session.get('activeLanguage')).calendar(null, {
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
		return moment(date).locale(Session.get('activeLanguage')).calendar(null, {
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
};
