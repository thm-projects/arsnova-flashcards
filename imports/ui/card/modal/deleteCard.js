import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";
import {Route} from "../../../api/route";
import {CardVisuals} from "../../../api/cardVisuals";
import {CardNavigation} from "../../../api/cardNavigation";
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
				Session.set('activeCard', undefined);
				$('#deleteCardModal').on('hidden.bs.modal', function () {
					$('.deleteCard').removeClass("pressed");
					if (Route.isEditMode()) {
						Router.go('cardsetdetailsid', {
							_id: Router.current().params._id
						});
					} else {
						CardVisuals.resizeFlashcard();
						CardNavigation.selectButton();
					}
				});
			}
		});
	}
});
