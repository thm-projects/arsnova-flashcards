import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import "./myCardsets.html";
import {Session} from "meteor/session";

Template.useCasesItemMyCardsets.helpers({
	gotCardIndex: function () {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			return Meteor.user().count.cardsets > 0;
		}
	}
});

Template.useCasesItemMyCardsetsButton.events({
	'click .useCaseGoToCardIndex': function () {
		Session.set('useCaseType', 5);
		$('#useCasesModal').modal('hide');
	}
});
