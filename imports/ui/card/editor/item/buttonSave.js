import {CardEditor} from "../../../../api/cardEditor.js";
import "./buttonSave.html";

/*
 * ############################################################################
 * cardEditorItemButtonSave
 * ############################################################################
 */

Template.cardEditorItemButtonSave.events({
	"click #cardSave": function () {
		CardEditor.saveCard(Router.current().params.card_id, 0);
	}
});
