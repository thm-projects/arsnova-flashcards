import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./create.html";

Template.useCasesItemCreateDropdown.events({
	'click .cardType': function (evt) {
		evt.preventDefault();
		let cardType = $(evt.currentTarget).attr("data");
		$('.setCardTypeUseCase').html($(evt.currentTarget).text());
		$('.setCardTypeUseCase').val(cardType);
		Session.set('useCaseSelectedCardType', Number(cardType));
		if (Number(cardType) > -1) {
			Session.set('useCaseType', 1);
			Session.set('isNewCardset', true);
			$('#useCasesModal').modal('hide');
		}
	}
});
