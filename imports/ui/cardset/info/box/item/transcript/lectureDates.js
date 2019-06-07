//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {TranscriptBonusList} from "../../../../../../api/transcriptBonus";
import {Session} from "meteor/session";
import "./lectureDates.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptLectureDates
* ############################################################################
*/

let lastMonth;
let lastYear;
Template.cardsetInfoBoxItemTranscriptLectureDates.helpers({
	getLectureDates: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			lastMonth = undefined;
			lastYear = undefined;
			let results = [];
			for (let i = 0; i < cardset.transcriptBonus.dates.length; i++) {
				let item = JSON.parse(JSON.stringify(cardset.transcriptBonus));
				item.date = new Date(cardset.transcriptBonus.dates[i]);
				results.push(item);
			}
			return results;
		}
	},
	isNewMonth: function (transcriptBonus) {
		let currentMonth = moment(transcriptBonus.date).month();
		if (currentMonth !== lastMonth) {
			lastMonth = currentMonth;
			return true;
		}
	},
	isNewYear: function (transcriptBonus) {
		let currentYear = moment(transcriptBonus.date).year();
		if (currentYear !== lastYear) {
			lastYear = currentYear;
			return true;
		}
	},
	getMonth: function () {
		return moment().month(lastMonth).locale(Session.get('activeLanguage')).format('MMMM');
	},
	getYear: function () {
		return lastYear;
	},
	//returnMode 0 = Return class
	//returnMode 1 = Return tooltip
	getStatus: function (transcriptBonus, returnMode = 0) {
		let current = moment();
		let lectureEndDate = TranscriptBonusList.addLectureEndTime(transcriptBonus, transcriptBonus.date);
		if (current > lectureEndDate && !TranscriptBonusList.isDeadlineExpired(transcriptBonus)) {
			if (returnMode) {
				return TAPi18n.__('transcriptForm.info.tooltip.lecture.active');
			} else {
				return "active";
			}
		} else if (current > lectureEndDate) {
			if (returnMode) {
				return TAPi18n.__('transcriptForm.info.tooltip.lecture.past');
			} else {
				return "past";
			}
		} else {
			if (returnMode) {
				return TAPi18n.__('transcriptForm.info.tooltip.lecture.future');
			} else {
				return "future";
			}
		}
	}
});
