import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import "./myCardsets.html";

Template.useCasesItemMyCardsets.helpers({
	gotCardIndex: function () {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			return Meteor.user().count.cardsets > 0;
		}
	}
});

Template.useCasesItemMyCardsetsButton.events({
	'click .useCaseGoToCardIndex': function () {
		Router.go('create');
		$('#useCasesModal').modal('hide');
	}
});
