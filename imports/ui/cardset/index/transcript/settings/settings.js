import "./settings.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardsetIndexTranscriptSettings
 * ############################################################################
 */

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
		$('#bonusMinimumStars').val(this.data.transcriptBonus.minimumStars);
		$('#minStarsValue').html(this.data.transcriptBonus.minimumStars);
		for (let d = 0; d < this.data.transcriptBonus.dates.length; d++) {
			dates.push(moment(this.data.transcriptBonus.dates[d]).format("MM/DD/YYYY"));
		}
	}
	let settings = {
		numberOfMonths: [1,3],
		onSelect: function () {
			let dates = $('#transcript-calendar').multiDatesPicker('getDates');
			let minimumSubmissions = $('#bonusMinimumSubmissions');
			if (minimumSubmissions.val() > dates.length) {
				minimumSubmissions.val(dates.length);
				$('#minSubmissionsValue').html(dates.length);
				adjustStarsSlider(dates.length);
			}
			minimumSubmissions.attr("max", dates.length);
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
});

Template.cardsetIndexTranscriptSettings.events({
	'input #bonusMinimumSubmissions': function (event) {
		$('#minSubmissionsValue').html(event.currentTarget.value);
		adjustStarsSlider(event.currentTarget.value);
	},
	'input #bonusMinimumStars': function (event) {
		$('#minStarsValue').html(event.currentTarget.value);
	}
});
