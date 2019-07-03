import "./settings.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardsetIndexTranscriptSettings
 * ############################################################################
 */

Template.cardsetIndexTranscriptSettings.onRendered(function () {
	let dates = [];
	if (this.data.transcriptBonus !== undefined) {
		$('#enableBonus').prop('checked', this.data.transcriptBonus.enabled);
		$('#bonusPercentage').val(this.data.transcriptBonus.percentage);
		$('#lectureTimeEnd').val(this.data.transcriptBonus.lectureEnd);
		$('#deadlineHoursSubmission').val(this.data.transcriptBonus.deadline);
		$('#deadlineHoursEditing').val(this.data.transcriptBonus.deadlineEditing);
		$('#bonusMinimumSubmissions').val(this.data.transcriptBonus.minimumSubmissions);
		for (let d = 0; d < this.data.transcriptBonus.dates.length; d++) {
			dates.push(moment(this.data.transcriptBonus.dates[d]).format("MM/DD/YYYY"));
		}
	}
	if (dates.length) {
		$('#transcript-calendar').multiDatesPicker({
			addDates: dates,
			numberOfMonths: [1, 3]
		});
	} else {
		$('#transcript-calendar').multiDatesPicker({
			numberOfMonths: [1, 3]
		});
	}
	let minimumSubmissions = $('#bonusMinimumSubmissions').val();
	$('#bonusMinimumSubmissions').attr("max", dates.length);
	if (minimumSubmissions > dates.length) {
		$('#bonusMinimumSubmissions').val(dates.length);
	}
	$('#transcript-calendar').multiDatesPicker({
		onSelect: function () {
			let dates = $('#transcript-calendar').multiDatesPicker('getDates');
			let minimumSubmissions = $('#bonusMinimumSubmissions').val();
			$('#bonusMinimumSubmissions').attr("max", dates.length);
			if (minimumSubmissions > dates.length) {
				$('#bonusMinimumSubmissions').val(dates.length);
			}
		}
	});
});
