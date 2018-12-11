import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";
import "./deleteCard.html";

/*
 * ############################################################################
 * deleteCardForm
 * ############################################################################
 */

Template.deleteCardForm.events({
	'click #deleteCardConfirm': function () {
		Meteor.call("deleteCard", Session.get('activeCard'), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
				$('#deleteCardModal').modal('hide');
				$('.modal-backdrop').css('display', 'none');
				$('#deleteCardModal').on('hidden.bs.modal', function () {
					$('.deleteCard').removeClass("pressed");
					Session.set('activeCard', undefined);
				});
			}
		});
	}
});
