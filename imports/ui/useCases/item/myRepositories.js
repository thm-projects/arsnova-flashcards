import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import "./myRepositories.html";

Template.useCasesItemMyRepositories.helpers({
	gotCardIndex: function () {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			return Meteor.user().count.shuffled > 0;
		}
	}
});

Template.useCasesItemMyRepositories.events({
	'click .useCaseGoToMyRepositories': function () {
		Session.set('useCaseType', 6);
		$('#useCasesModal').modal('hide');
	}
});
