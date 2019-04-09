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
	'click .useCasesItemMyTranscriptsButton': function () {
		Session.set('useCaseType', 7);
		$('#useCasesModal').modal('hide');
	}
});
