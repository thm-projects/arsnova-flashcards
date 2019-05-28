import "./buttonCancel.html";
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
				Router.go('transcriptsBonus');
			} else {
				Router.go('transcriptsPersonal');
			}
		} else {
			Session.set('activeCard', Router.current().params.card_id);
			if (Route.isNewCard()) {
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			} else {
				if (Session.get('cardEditMode') !== undefined) {
					CardEditor.goBackToPreviousRoute();
				} else {
					Router.go('presentation', {
						_id: Router.current().params._id
					});
				}
			}
		}
	}
});
