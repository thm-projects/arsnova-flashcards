import {CardEditor} from "../../../../util/cardEditor.js";
import {CardIndex} from "../../../../util/cardIndex";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import "./buttonSaveNext.html";

/*
 * ############################################################################
 * cardEditorItemButtonSaveNext
 * ############################################################################
 */

Template.cardEditorItemButtonSaveNext.helpers({
	gotMultipleCards: function () {
		if (Session.get('cardEditMode') !== undefined) {
			let previousRoute = Session.get('cardEditMode').route;
			if (previousRoute === "leitner" || previousRoute === "wozniak") {
				return false;
			}
		}
		CardIndex.initializeIndex();
		return CardIndex.getCardIndex().length > 1;
	}
});

Template.cardEditorItemButtonSaveNext.events({
	"click #cardSaveNext": function () {
		CardEditor.saveCard(FlowRouter.getParam('card_id'), 2);
	}
});
