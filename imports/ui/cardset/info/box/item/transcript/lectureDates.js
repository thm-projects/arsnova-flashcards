//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {TranscriptBonusList} from "../../../../../../api/transcriptBonus";
import "./lectureDates.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptLectureDates
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptLectureDates.helpers({
	getLectureDates: function (cardset) {
		if (cardset.transcriptBonus !== undefined) {
			let results = [];
			for (let i = 0; i < cardset.transcriptBonus.dates.length; i++) {
				let item = JSON.parse(JSON.stringify(cardset.transcriptBonus));
				item.date = new Date(cardset.transcriptBonus.dates[i]);
				results.push(item);
			}
			return results;
		}
	},
	//returnMode 0 = Return class
	//returnMode 1 = Return tooltip
	getStatus: function (transcriptBonus, returnMode = 0) {
		let current = moment();
		let lectureDate = moment(transcriptBonus.date);
		if (current > lectureDate && !TranscriptBonusList.isDeadlineExpired(transcriptBonus)) {
			if (returnMode) {
				return TAPi18n.__('transcriptForm.info.tooltip.lecture.active');
			} else {
				return "active";
			}
		} else if (current > lectureDate) {
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
