import {CardEditor} from "../../../../util/cardEditor.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./buttonSaveReturn.html";

/*
 * ############################################################################
 * cardEditorItemButtonSaveReturn
 * ############################################################################
 */

Template.cardEditorItemButtonSaveReturn.events({
	"click #cardSaveReturn": function () {
		CardEditor.saveCard(FlowRouter.getParam('card_id'), 1);
	}
});
