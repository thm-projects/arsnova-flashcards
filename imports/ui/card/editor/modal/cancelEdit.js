import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../../../util/route.js";
import "./cancelEdit.html";

/*
 * ############################################################################
 * cancelEditForm
 * ############################################################################
 */

Template.cancelEditForm.events({
	'click #cancelEditConfirm': function () {
		$('#cancelEditModal').on('hidden.bs.modal', function () {
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
					FlowRouter.go('presentation', {
						_id: FlowRouter.getParam('_id')
					});
				}
			}
		}).modal('hide');
	}
});
