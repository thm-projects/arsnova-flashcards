//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {BertAlertVisuals} from "../../../util/bertAlertVisuals";
import "./membership.html";

/*
 * ############################################################################
 * profileMembership
 * ############################################################################
 */

Template.profileMembership.rendered = function () {
	var customerId = Meteor.user().customerId;

	Meteor.call('getClientToken', customerId, function (error, clientToken) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
		} else {
			if ($('#subscribe-form').length) {
				braintree.setup(clientToken, "dropin", {
					container: "subscribe-form",
					defaultFirst: true,
					onPaymentMethodReceived: function (response) {
						$('#upgrade').prop("disabled", true);

						BertAlertVisuals.displayBertAlert(TAPi18n.__('membership.upgrade.progress'), 'info', 'growl-top-left');
						var nonce = response.nonce;
						var plan = Session.get('plan');
						Meteor.call('btSubscribe', nonce, plan, function (error) {
							if (error) {
								throw new Meteor.Error(error.message, 'error');
							} else {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('membership.upgrade.subscribed'), 'success', 'growl-top-left');
							}
						});
					}
				});
			}
		}
	});
};

Template.profileMembership.events({
	"click #upgrade": function () {
		Session.set('plan', 'pro');
	},
	"click #downgrade": function () {
		var hasPro = Cardsets.find({owner: Meteor.userId(), kind: 'pro'}).count();
		if (hasPro > 0) {
			BertAlertVisuals.displayBertAlert(TAPi18n.__('membership.downgrade.error'), 'danger', 'growl-top-left');
		} else {
			var confirmCancel = confirm(TAPi18n.__('membership.downgrade.confirm'));
			if (confirmCancel) {
				$('#downgrade').prop("disabled", true);
				Session.set('plan', 'standard');

				Meteor.call('btCancelSubscription', function (error, response) {
					if (error) {
						BertAlertVisuals.displayBertAlert(error.reason, "danger", 'growl-top-left');
					} else {
						if (response.error) {
							BertAlertVisuals.displayBertAlert(response.error.message, "danger", 'growl-top-left');
						} else {
							Session.set('currentUserPlan_' + Meteor.userId(), null);
							BertAlertVisuals.displayBertAlert(TAPi18n.__('membership.downgrade.canceled'), 'success', 'growl-top-left');
						}
					}
				});
			}
		}
	},
	"click #sendLecturerRequest": function () {
		var text = Meteor.user().profile.name + " möchte Dozent werden.";
		var type = "Dozenten-Anfrage";
		var target = "admin";

		Meteor.call("addNotification", target, type, text, Meteor.userId(), target);
		Meteor.call("setLecturerRequest", Meteor.userId(), true);
		BertAlertVisuals.displayBertAlert('Anfrage wurde gesendet', 'success', 'growl-top-left');
	}
});

Template.profileMembership.helpers({
	hasUserData: function () {
		var email = Meteor.user().email;
		return email !== "" && email !== undefined;
	}
});
