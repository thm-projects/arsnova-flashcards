import "./settings.html";
import "./item/deadlineEditing.js";
import "./item/deadlineSubmissions.js";
import "./item/enable.js";
import "./item/editTitle.js";
import "./item/lectureDates.js";
import "./item/lectureTimeEnd.js";
import "./item/maxPercentage.js";
import "./item/minimumStars.js";
import "./item/minimumTranscripts.js";
import "./modal/setTitle.js";
import * as config from "../../../../../config/transcriptBonus.js";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptSettings
 * ############################################################################
 */

Session.setDefault('minimumBonusStars', 1);
Session.setDefault('transcriptBonusLectures', []);
Session.setDefault('transcriptBonusTempLectures', []);

function adjustStarsSlider(value) {
	let bonusMinimumStars = $('#bonusMinimumStars');
	bonusMinimumStars.attr("min", value);
	bonusMinimumStars.attr("max", value * 5);
	$('#minStarsValue').html(bonusMinimumStars.val());
}

Template.cardsetIndexTranscriptSettings.onRendered(function () {
	let dates = [];
	if (this.data.transcriptBonus !== undefined) {
		$('#enableBonus').prop('checked', this.data.transcriptBonus.enabled);
		$('#bonusPercentage').val(this.data.transcriptBonus.percentage);
		$('#lectureTimeEnd').val(this.data.transcriptBonus.lectureEnd);
		$('#deadlineHoursSubmission').val(this.data.transcriptBonus.deadline);
		$('#deadlineHoursEditing').val(this.data.transcriptBonus.deadlineEditing);
		$('#bonusMinimumSubmissions').val(this.data.transcriptBonus.minimumSubmissions);
		$('#minSubmissionsValue').html(this.data.transcriptBonus.minimumSubmissions);
		adjustStarsSlider(this.data.transcriptBonus.minimumSubmissions);
		Session.set('minimumBonusStars', this.data.transcriptBonus.minimumStars);
		for (let d = 0; d < this.data.transcriptBonus.lectures.length; d++) {
			dates.push(moment(this.data.transcriptBonus.lectures[d].date).format("MM/DD/YYYY"));
		}
	}
	let settings = {
		numberOfMonths: [1,config.numberOfDisplayedMonths],
		onSelect: function () {
			let dates = $('#transcript-calendar').multiDatesPicker('getDates', 'object');
			let minimumSubmissions = $('#bonusMinimumSubmissions');
			if (minimumSubmissions.val() > dates.length) {
				minimumSubmissions.val(dates.length);
				$('#minSubmissionsValue').html(dates.length);
				adjustStarsSlider(dates.length);
			}
			minimumSubmissions.attr("max", dates.length);
			let lectures = [];
			let oldLectures = Session.get('transcriptBonusLectures');
			for (let i = 0; i < dates.length; i++) {
				let lecture = {
					date: dates[i]
				};
				for (let k = 0; k < oldLectures.length; k++) {
					if (lecture.date.getTime() === oldLectures[k].date.getTime()) {
						lecture.title = oldLectures[k].title;
						oldLectures = oldLectures.splice(k, 1);
						break;
					}
				}
				lectures.push(lecture);
			}
			return Session.set('transcriptBonusLectures', lectures);
		}};
	if (dates.length) {
		settings.addDates = dates;
	}
	let minimumSubmissions = $('#bonusMinimumSubmissions');
	if (minimumSubmissions.val() > dates.length) {
		minimumSubmissions.val(dates.length);
		$('#minSubmissionsValue').html(dates.length);
		adjustStarsSlider(dates.length);
	}
	minimumSubmissions.attr("max", dates.length);
	$('#transcript-calendar').multiDatesPicker(settings);
	if (this.data.transcriptBonus !== undefined && this.data.transcriptBonus.lectures !== undefined) {
		Session.set('transcriptBonusLectures', this.data.transcriptBonus.lectures);
	}
});

Template.cardsetIndexTranscriptSettings.onDestroyed(function () {
	if (this.data.transcriptBonus !== undefined) {
		Session.set('minimumBonusStars', this.data.transcriptBonus.minimumStars);
	}
});

Template.cardsetIndexTranscriptSettings.helpers({
	gotTranscriptBonusLectures: function () {
		return Session.get('transcriptBonusLectures').length;
	}
});

Template.cardsetIndexTranscriptSettings.events({
	'input #bonusMinimumSubmissions': function (event) {
		$('#minSubmissionsValue').html(event.currentTarget.value);
	},
	'click .stars-setting': function (event) {
		Session.set('minimumBonusStars', $(event.currentTarget).data('id') + 1);
	}
});
