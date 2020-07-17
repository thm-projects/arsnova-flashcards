import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {ServerStyle} from "../../../util/styles";
import {UserPermissions} from "../../../util/permissions";
import "./repetitorium.html";

Template.useCasesItemRepetitorium.helpers({
	gotRepetitorium: function () {
		let counter = Counts.get('repetitoriumFreeCounter') + Counts.get('repetitoriumEduCounter');
		if (ServerStyle.isLoginEnabled("pro")) {
			counter += Counts.get('repetitoriumProCounter');
		}
		if (UserPermissions.isAdmin()) {
			counter += Counts.get('repetitoriumPrivateCounter');
		}
		return counter;
	}
});

Template.useCasesItemRepetitoriumButton.events({
	'click .useCaseGoToRepetitorium': function () {
		Session.set('useCaseType', 2);
		$('#useCasesModal').modal('hide');
	}
});
