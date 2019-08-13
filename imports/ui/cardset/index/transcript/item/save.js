import "./save.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../../api/bertAlertVisuals";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptItemSave
 * ############################################################################
 */

Template.cardsetIndexTranscriptItemSave.events({
	'click #transcript-bonus-save': function () {
		let isEnabled = $('#enableBonus:checked').is(":checked");
		let percentage = $('#bonusPercentage').val();
		let lectureEnd = $('#lectureTimeEnd').val();
		let deadlineEditing = $('#deadlineHoursEditing').val();
		let deadlineSubmission = $('#deadlineHoursSubmission').val();
		let dates = $('#transcript-calendar').multiDatesPicker('getDates');
		let minimumSubmissions = $('#bonusMinimumSubmissions').val();
		let minimumStars = Session.get('minimumBonusStars');
		let newDates = [];
		for (let d = 0; d < dates.length; d++) {
			newDates.push(moment(dates[d], "MM/DD/YYYY").toDate());
		}
		Meteor.call('updateCardsetTranscriptBonus', Router.current().params._id, Boolean(isEnabled), Number(percentage), lectureEnd, Number(deadlineSubmission), Number(deadlineEditing), newDates, Number(minimumSubmissions), Number(minimumStars), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('transcriptForm.bonus.form.alert.save'), "success", 'growl-top-left');
			}
		});
	}
});
