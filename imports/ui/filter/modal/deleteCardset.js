//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./deleteCardset.html";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";

/*
 * ############################################################################
 * cardsetDeleteForm
 * ############################################################################
 */

Template.cardsetDeleteForm.events({
	'click #deleteCardset': function () {
		Meteor.call("deleteCardset", Session.get('cardsetId'), (error) => {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.failure'), "danger", 'growl-top-left');
			} else {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.success'), "success", 'growl-top-left');
			}
			$('#confirmDeleteCardsetModal').modal('hide');
		});
	}
});
