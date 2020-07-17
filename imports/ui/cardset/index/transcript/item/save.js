import "./save.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../../util/bertAlertVisuals";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
		let minimumSubmissions = $('#bonusMinimumSubmissions').val();
		let minimumStars = Session.get('minimumBonusStars');
		let newLectures = Session.get('transcriptBonusLectures');
		Meteor.call('updateCardsetTranscriptBonus', FlowRouter.getParam('_id'), Boolean(isEnabled), Number(percentage), lectureEnd, Number(deadlineSubmission), Number(deadlineEditing), newLectures, Number(minimumSubmissions), Number(minimumStars), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('transcriptForm.bonus.form.alert.save'), "success", 'growl-top-left');
			}
		});
	}
});
