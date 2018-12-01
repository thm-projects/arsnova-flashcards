import {CardEditor} from "../../../../api/cardEditor.js";
import {CardIndex} from "../../../../api/cardIndex";
import "./buttonSaveNext.html";

/*
 * ############################################################################
 * cardEditorItemButtonSaveNext
 * ############################################################################
 */

Template.cardEditorItemButtonSaveNext.helpers({
	gotMultipleCards: function () {
		CardIndex.initializeIndex();
		return CardIndex.getCardIndex().length > 1;
	}
});

Template.cardEditorItemButtonSaveNext.events({
	"click #cardSaveNext": function () {
		CardEditor.saveCard(Router.current().params.card_id, 2);
	}
});
