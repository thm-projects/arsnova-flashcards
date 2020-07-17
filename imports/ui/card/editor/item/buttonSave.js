import {CardEditor} from "../../../../util/cardEditor.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./buttonSave.html";

/*
 * ############################################################################
 * cardEditorItemButtonSave
 * ############################################################################
 */

Template.cardEditorItemButtonSave.events({
	"click #cardSave": function () {
		CardEditor.saveCard(FlowRouter.getParam('card_id'), 0);
	}
});
