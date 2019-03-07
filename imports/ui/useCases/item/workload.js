import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import "./workload.html";

Template.useCasesItemWorkload.helpers({
	gotWorkload: function () {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			return Meteor.user().count.workload > 0;
		}
	}
});

Template.useCasesItemWorkloadButton.events({
	'click .useCaseGoToWorkload': function () {
		Session.set('useCaseType', 4);
		$('#useCasesModal').modal('hide');
	}
});
