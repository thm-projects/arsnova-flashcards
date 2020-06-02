import "./buttonCancel.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Route} from "../../../../api/route";
import {Session} from "meteor/session";
import {CardEditor} from "../../../../api/cardEditor";

/*
 * ############################################################################
 * cardEditorItemButtonCancel
 * ############################################################################
 */

Template.cardEditorItemButtonCancel.events({
	'click #cardCancel': function () {
		if (Route.isTranscript()) {
			if (Session.get('transcriptBonus') !== undefined) {
				FlowRouter.go('transcriptsBonus');
			} else {
				FlowRouter.go('transcriptsPersonal');
			}
		} else {
			Session.set('activeCard', FlowRouter.getParam('card_id'));
			if (Route.isNewCard()) {
				FlowRouter.go('cardsetdetailsid', {
					_id: FlowRouter.getParam('_id')
				});
			} else {
				if (Session.get('cardEditMode') !== undefined) {
					CardEditor.goBackToPreviousRoute();
				} else {
					FlowRouter.go('presentation', {
						_id: FlowRouter.getParam('_id')
					});
				}
			}
		}
	}
});
