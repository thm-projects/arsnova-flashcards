import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {BertAlertVisuals} from "../../../util/bertAlertVisuals";
import "./deleteTranscript.html";

/*
 * ############################################################################
 * deleteTranscriptForm
 * ############################################################################
 */

Template.deleteTranscriptForm.events({
	'click #deleteTranscriptConfirm': function () {
		Meteor.call("deleteTranscript", Session.get('activeCard'), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
				$('#deleteTranscriptModal').modal('hide');
				$('.modal-backdrop').css('display', 'none');
				$('#deleteTranscriptModal').on('hidden.bs.modal', function () {
					Session.set('activeCard', undefined);
				});
			}
		});
	}
});
