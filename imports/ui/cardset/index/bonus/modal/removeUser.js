//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./removeUser.html";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../../api/bertAlertVisuals";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
* ############################################################################
* removeUserFromBonusModal
* ############################################################################
*/

Template.removeUserFromBonusModal.onCreated(function () {
	$('#removeUserFromBonusModal').on('hidden.bs.modal', function () {
		Session.set('selectedBonusUser', undefined);
	});
});

Template.removeUserFromBonusModal.helpers({
	userData: function () {
		return Session.get('selectedBonusUser');
	}
});

Template.removeUserFromBonusModal.events({
	"click #removeUserFromBonusConfirm": function () {
		if (Session.get('selectedBonusUser') !== undefined) {
			Meteor.call('removeUserFromBonus', FlowRouter.getParam('_id'), Session.get('selectedBonusUser').user_id, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
				}
				if (result) {
					Session.set("learnerStats", result);
					BertAlertVisuals.displayBertAlert(TAPi18n.__('leitnerProgress.bertAlert.userRemoved'), 'success', 'growl-top-left');
				}
			});
			$('#removeUserFromBonusModal').modal("hide");
		}
	}
});
