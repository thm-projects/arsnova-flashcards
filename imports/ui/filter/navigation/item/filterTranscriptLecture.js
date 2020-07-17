import "./filterTranscriptLecture.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../util/filter";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../api/transcriptBonus";

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
			fields: {date: 1, cardset_id: 1}, sort: {date: -1}
		}).fetch(), function (transcriptBonus) {
			return transcriptBonus.date.getTime();
		});
	},
	getLectureName: function (transcriptBonus) {
		let item = {date: new Date(transcriptBonus.date), lectureEnd: "00:00", cardset_id: transcriptBonus.cardset_id};
		return TranscriptBonusList.getLectureName(item, false);
	},
	resultsFilterTranscriptLecture: function (transcriptBonus) {
		return Filter.getActiveFilter().transcriptDate === transcriptBonus.date.getTime();
	},
	getLectureTime: function (date) {
		return date.getTime();
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
