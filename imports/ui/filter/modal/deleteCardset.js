//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {BertAlertVisuals} from "../../../util/bertAlertVisuals";
import {Route} from "../../../util/route";
import "./deleteCardset.html";

/*
 * ############################################################################
 * cardsetDeleteForm
 * ############################################################################
 */

Template.cardsetDeleteForm.events({
	'click #deleteCardset': function () {
		Meteor.call("deleteCardset", Session.get('cardsetId'), (error) => {
			if (error) {
				if (Route.isRepetitorienFilterIndex()) {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.repetitorium.failure'), "danger", 'growl-top-left');
				} else {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.failure'), "danger", 'growl-top-left');
				}
			} else {
				if (Route.isRepetitorienFilterIndex()) {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.repetitorium.success'), "success", 'growl-top-left');
				} else {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.success'), "success", 'growl-top-left');
				}
			}
			$('#confirmDeleteCardsetModal').modal('hide');
		});
	}
});
