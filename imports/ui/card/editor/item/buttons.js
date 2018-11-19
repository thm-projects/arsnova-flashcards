import {Route} from "../../../../api/route.js";
import {CardEditor} from "../../../../api/cardEditor.js";
import {Cardsets} from "../../../../api/cardsets.js";
import "./buttons.html";

/*
 * ############################################################################
 * btnCard
 * ############################################################################
 */

Template.btnCard.helpers({
	isEditMode: function () {
		return Route.isEditMode();
	},
	learningActive: function () {
		return Cardsets.findOne(Router.current().params._id).learningActive;
	}
});

Template.btnCard.events({
	"click #cardSave": function () {
		CardEditor.saveCard(Router.current().params.card_id, false);
	},
	"click #cardSaveReturn": function () {
		CardEditor.saveCard(Router.current().params.card_id, true);
	}
});
