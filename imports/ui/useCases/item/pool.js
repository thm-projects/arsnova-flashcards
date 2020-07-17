import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./pool.html";
import {ServerStyle} from "../../../util/styles";

Template.useCasesItemPool.helpers({
	gotPool: function () {
		let counter = Counts.get('cardsetsFreeCounter') + Counts.get('cardsetsEduCounter');
		if (ServerStyle.isLoginEnabled("pro")) {
			counter += Counts.get('cardsetsProCounter');
		}
		return counter;
	}
});

Template.useCasesItemPoolButton.events({
	'click .useCaseGoToPool': function () {
		Session.set('useCaseType', 3);
		$('#useCasesModal').modal('hide');
	}
});
