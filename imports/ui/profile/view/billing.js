//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";
import {Paid} from "../../../api/paid";
import "./billing.html";

/*
 * ############################################################################
 * profileBilling
 * ############################################################################
 */

Template.profileBilling.onCreated(function () {
	Session.set("switchedSitesCheck", undefined);
});

Template.profileBilling.onRendered(function () {
	var customerId = Meteor.user().customerId;

	Meteor.call('getClientToken', customerId, function (error, clientToken) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
		} else {
			if ($('#paymentMethodDropIn').length) {
				braintree.setup(clientToken, "dropin", {
					container: "paymentMethodDropIn",
					defaultFirst: true,
					onPaymentMethodReceived: function (response) {
						$('#savePaymentBtn').prop("disabled", true);

						BertAlertVisuals.displayBertAlert(TAPi18n.__('billing.payment.progress'), 'info', 'growl-top-left');
						var nonce = response.nonce;
						Meteor.call('btUpdatePaymentMethod', nonce, function (error) {
							if (error) {
								throw new Meteor.Error(error.message, 'error');
							} else {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('billing.payment.saveMsg'), 'success', 'growl-top-left');
								$('#savePaymentBtn').prop("disabled", false);
							}
						});
					}
				});
			}
		}
	});


	Meteor.call('getClientToken', customerId, function (error, clientToken) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
		} else {
			if ($('#payoutDropIn').length) {
				braintree.setup(clientToken, "dropin", {
					container: "payoutDropIn",
					onPaymentMethodReceived: function (response) {
						$('#payoutBtn').prop("disabled", true);
						BertAlertVisuals.displayBertAlert(TAPi18n.__('billing.balance.progress'), 'info', 'growl-top-left');

						var nonce = response.nonce;

						Meteor.call('btCreateCredit', nonce, function (error, success) {
							if (error) {
								throw new Meteor.Error('transaction-creation-failed');
							} else if (success !== undefined && success.name === "authorizationError") {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('billing.balance.failed'), 'danger', 'growl-top-left');
							} else {
								Meteor.call("resetUsersBalance", Meteor.userId());
								BertAlertVisuals.displayBertAlert(TAPi18n.__('billing.balance.success'), 'success', 'growl-top-left');
								$('#payoutBtn').prop("disabled", false);
							}
						});
					}
				});
			}
		}
	});
});

Template.profileBilling.helpers({
	getInvoices: function () {
		return Paid.find({user_id: Meteor.userId()}, {sort: {date: -1}});
	},
	getRevenue: function () {
		var cardsetsIds = Cardsets.find({
			owner: Meteor.userId()
		}).map(function (cardset) {
			return cardset._id;
		});

		return Paid.find({cardset_id: {$in: cardsetsIds}}, {sort: {date: -1}});
	},
	getCardsetName: function (cardset_id) {
		return (cardset_id !== undefined) ? Cardsets.findOne(cardset_id).name : undefined;
	},
	getBalance: function () {
		Meteor.subscribe("privateUserData");
		var balance = Meteor.users.findOne(Meteor.userId).balance;
		return (balance !== undefined) ? parseFloat(balance).toFixed(2) : 0;
	},
	hasBalance: function () {
		Meteor.subscribe("privateUserData");
		var balance = Meteor.users.findOne(Meteor.userId).balance;
		return balance > 0;
	},
	getPaymentMethod: function () {
		Meteor.call("btGetPaymentMethod", function (error, result) {
			if (result) {
				Session.set("paymentMethods", result);
			}
		});
		return Session.get('paymentMethods');
	},
	hasPaymentMethod: function () {
		Meteor.call("btGetPaymentMethod", function (error, result) {
			if (result) {
				Session.set("hasPaymentMethods", !jQuery.isEmptyObject(result));
			}
		});
		return Session.get('hasPaymentMethods');
	}
});
