import "./transcript.html";
import "./pages/settings.js";
import "./pages/statistics.js";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Bonus} from "../../../api/bonus";
import {Filter} from "../../../api/filter";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";

Session.setDefault('transcriptViewingMode', 0);

/*
 * ############################################################################
 * cardsetTranscript
 * ############################################################################
 */

Template.cardsetTranscript.onCreated(function () {
	Filter.resetActiveFilter();
});

Template.cardsetTranscript.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardsetTranscript.events({
	'click #showTranscriptList': function () {
		Session.set('transcriptViewingMode', 2);
	},
	'click #showTranscriptStatistics': function () {
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
