import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import "./myTranscripts.html";

Template.useCasesItemMyTranscripts.helpers({
	gotCardIndex: function () {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			return Meteor.user().count.transcripts > 0;
		}
	}
});

Template.useCasesItemMyTranscripts.events({
	'click .useCasesGoToMyTranscripts': function () {
		if (Meteor.user() && Meteor.user().count !== undefined && Meteor.user().count.bonusTranscripts > 0) {
			Session.set('useCaseType', 8);
		} else {
			Session.set('useCaseType', 7);
		}
		$('#useCasesModal').modal('hide');
	}
});
