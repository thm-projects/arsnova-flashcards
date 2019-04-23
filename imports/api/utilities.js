import {Session} from "meteor/session";

export let Utilities = class Utilities {
	static getCalendarString (type = '', minutes = '') {
		let today = '[Today]';
		let yesterday = '[Yesterday]';
		if (Session.get('activeLanguage') === 'de') {
			if (minutes !== '') {
				minutes = '[ ]' + minutes;
			}
			today = '[Heute]';
			yesterday = '[Gestern]';
		} else {
			if (minutes !== '') {
				minutes = '[ at ]' + minutes;
			}
		}
		switch (type) {
			case "today":
				return today + minutes;
			case "yesterday":
				return yesterday + minutes;
		}
	}

	static getMomentsDate (date, displayMinutes = false) {
		let minutes = "";
		let dateFormat = "D. MMMM YYYY";
		if (displayMinutes === true) {
			dateFormat = "D. MMM YY " + minutes;
			minutes = "H:mm";
		}
		return moment(date).locale(Session.get('activeLanguage')).calendar(null, {
			sameDay: this.getCalendarString("today", minutes),
			lastDay: this.getCalendarString("yesterday", minutes),
			nextWeek: dateFormat,
			lastWeek: dateFormat,
			sameElse: dateFormat
		});
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
};
