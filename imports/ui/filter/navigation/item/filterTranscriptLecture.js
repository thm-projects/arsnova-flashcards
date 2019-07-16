import "./filterTranscriptLecture.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../api/filter";
import {TranscriptBonus, TranscriptBonusList} from "../../../../api/transcriptBonus";

/*
 * ############################################################################
 * filterItemFilterTranscriptLecture
 * ############################################################################
 */

Template.filterItemFilterTranscriptLecture.helpers({
	hasTranscriptLectureFilter: function () {
		return Filter.getActiveFilter().transcriptDate !== undefined;
	},
	getTranscriptLectures: function () {
		let activeFilter = Filter.getActiveFilter();
		let query = {};
		if (activeFilter.user_id !== undefined) {
			query.user_id = activeFilter.user_id;
		}
		if (activeFilter.rating !== undefined) {
			query.rating = activeFilter.rating;
		}
		return _.uniq(TranscriptBonus.find(query, {
			fields: {date: 1}, sort: {date: -1}
		}).fetch().map(function (x) {
			return x.date.getTime();
		}), true);
	},
	getLectureName: function (date) {
		let transcriptBonus = {date: new Date(date), lectureEnd: "00:00"};
		return TranscriptBonusList.getLectureName(transcriptBonus, false);
	},
	resultsFilterTranscriptLecture: function (date) {
		return Filter.getActiveFilter().transcriptDate === date;
	}
});

Template.filterItemFilterTranscriptLecture.events({
	'click .noFilterTranscriptLecture': function () {
		Filter.setActiveFilter(undefined, "transcriptLecture");
	},
	'click .filterTranscriptLecture': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "transcriptLecture");
	}
});
