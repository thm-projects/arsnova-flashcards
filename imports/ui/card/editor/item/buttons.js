import {CardEditor} from "../../../../api/cardEditor.js";
import {Cardsets} from "../../../../api/cardsets.js";
import "./buttons.html";
import {CardIndex} from "../../../../api/cardIndex";

/*
 * ############################################################################
 * btnCard
 * ############################################################################
 */

Template.btnCard.helpers({
	learningActive: function () {
		return Cardsets.findOne(Router.current().params._id).learningActive;
	},
	gotMultipleCards: function () {
		CardIndex.initializeIndex();
		return CardIndex.getCardIndex().length > 1;
	}
});

Template.btnCard.events({
	"click #cardSave": function () {
		CardEditor.saveCard(Router.current().params.card_id, 0);
	},
	"click #cardSaveReturn": function () {
		CardEditor.saveCard(Router.current().params.card_id, 1);
	},
	"click #cardSaveNext": function () {
		CardEditor.saveCard(Router.current().params.card_id, 2);
	}
});
