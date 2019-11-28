import "./specialCardsets.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

Template.useCasesItemSpecialCardsets.helpers({
	gotSpecialCardset: function () {
		if (Session.get('useCaseCardsets') !== undefined) {
			return Session.get('useCaseCardsets').length > 0;
		}
	},
	getSpecialCardset: function () {
		return Session.get('useCaseCardsets');
	}
});

Template.useCasesItemSpecialCardsets.events({
	'click .specialCardset': function (event) {
		event.preventDefault();
		Session.set('useCaseType', 9);
		Session.set('useCaseTarget', $(event.currentTarget).data('id'));
		$('#useCasesModal').modal('hide');
	}
});
