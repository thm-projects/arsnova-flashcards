import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../../api/route";
import "./create.html";

Template.useCasesItemCreateDropdown.events({
	'click .cardType': function (evt) {
		let cardType = $(evt.currentTarget).attr("data");
		$('.setCardTypeUseCase').html($(evt.currentTarget).text());
		$('.setCardTypeUseCase').val(cardType);
		Session.set('useCaseSelectedCardType', Number(cardType));
	}
});

Template.useCasesItemCreateButton.helpers({
	selectedCardType: function () {
		return Session.get('useCaseSelectedCardType') > -1;
	}
});

Template.useCasesItemCreateButton.events({
	'click .useCaseCreateIndex': function () {
		Session.set('useCaseType', 1);
		Session.set('isNewCardset', true);
		if (Route.isMyCardsets()) {
			$('#setCardsetFormModal').modal('show');
		} else {
			Router.go('create');
		}
		$('#useCasesModal').modal('hide');
	}
});
