import "./transcript.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Bonus} from "../../../api/bonus";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";

Session.setDefault('transcriptViewingMode', 1);

/*
 * ############################################################################
 * cardsetTranscript
 * ############################################################################
 */

Template.cardsetTranscript.helpers({
	isEditViewActive: function () {
		return Session.get('transcriptViewingMode') === 0;
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardsetTranscript.events({
	'click #showTranscriptList': function () {
		Session.set('transcriptViewingMode', 1);
	},
	'click #showTranscriptSettings': function () {
		Session.set('transcriptViewingMode', 0);
	},
	'click #transcript-bonus-cancel': function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	},
	'click #transcript-bonus-save': function () {
		let isEnabled = $('#enableBonus:checked').is(":checked");
		let percentage = $('#bonusPercentage').val();
		let lectureEnd = $('#lectureTimeEnd').val();
		let deadlineEditing = $('#deadlineHoursEditing').val();
		let deadlineSubmission = $('#deadlineHoursSubmission').val();
		let dates = $('#transcript-calendar').multiDatesPicker('getDates');
		let minimumSubmissions = $('#bonusMinimumSubmissions').val();
		let newDates = [];
		for (let d = 0; d < dates.length; d++) {
			newDates.push(moment(dates[d], "MM/DD/YYYY").toDate());
		}
		Meteor.call('updateCardsetTranscriptBonus', Router.current().params._id, Boolean(isEnabled), Number(percentage), lectureEnd, Number(deadlineSubmission), Number(deadlineEditing), newDates, Number(minimumSubmissions), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('transcriptForm.bonus.form.alert.save'), "success", 'growl-top-left');
			}
		});
	}
});

/*
 * ############################################################################
 * cardsetTranscriptEditor
 * ############################################################################
 */

Template.cardsetTranscriptEditor.onRendered(function () {
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
			numberOfMonths: [1, 6]
		});
	} else {
		$('#transcript-calendar').multiDatesPicker({
			numberOfMonths: [1, 6]
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

/*
 * ############################################################################
 * cardsetTranscriptEditorCancel
 * ############################################################################
 */

Template.cardsetTranscriptEditorCancel.events({
	'click #transcript-bonus-cancel': function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
