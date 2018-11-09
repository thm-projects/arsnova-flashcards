//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {CardNavigation} from "../../api/cardNavigation";
import {BertAlertVisuals} from "../../api/bertAlertVisuals";
import {CardsetNavigation} from "../../api/cardsetNavigation";
import {Bonus} from "../../api/bonus";
import "../card/card.js";
import "../learn/learn.js";
import "../presentation/presentation.js";
import "../forms/bonusForm.js";
import "../forms/cardsetForm.js";
import "./index/cards/cards.js";
import "./index/editors/editors.js";
import "./info/info.js";
import "./preview.js";
import "./index/bonus/bonus.js";
import "./cardset.html";

Meteor.subscribe("paid");
Meteor.subscribe("notifications");

/*
 * ############################################################################
 * cardset
 * ############################################################################
 */

Template.cardset.onCreated(function () {
	if (Session.get('activeCardset') === undefined || Session.get('activeCardset')._id !== Router.current().params._id) {
		Session.set('activeCardset', Cardsets.findOne(Router.current().params._id));
		Session.set('activeCard', undefined);
	}
	if (Number(Session.get('activeCard')) === Number(-1)) {
		Session.set('activeCard', undefined);
	}
	Session.set('shuffled', Cardsets.findOne(Router.current().params._id).shuffled);
	Session.set('cameFromEditMode', false);
	CardNavigation.toggleVisibility(true);
});

Template.cardset.rendered = function () {
	var customerId = Meteor.user().customerId;
	if ($('#payment-form').length) {
		Meteor.call('getClientToken', customerId, function (error, clientToken) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
			} else {
				braintree.setup(clientToken, "dropin", {
					container: "payment-form",
					onPaymentMethodReceived: function (response) {
						$('#buyCardsetBtn').prop("disabled", true);

						var nonce = response.nonce;

						Meteor.call('btCreateTransaction', nonce, Router.current().params._id, function (error) {
							if (error) {
								throw new Meteor.Error('transaction-creation-failed');
							} else {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.money.bought'), 'success', 'growl-top-left');
							}
						});
					}
				});
			}
		});
	}
	$('html, body').animate({scrollTop: '0px'}, 0);
};

Template.cardset.helpers({
	'selectedForLearning': function () {
		if (Session.get('selectingCardsetToLearn')) {
			CardsetNavigation.addToLeitner(this._id);
			Meteor.call("addWozniakCards", this._id);
			Session.set("selectingCardsetToLearn", false);
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.alert.addedToWorkload'), 'success', 'growl-top-left');
		}
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardset.events({
	'click #cardSetDelete': function () {
		$("#cardSetDelete").css('display', "none");
		$("#cardSetConfirm").css('display', "");

		$('#setCardsetFormModal').on('hidden.bs.modal', function () {
			$("#cardSetDelete").css('display', "");
			$("#cardSetConfirm").css('display', "none");
		});
	},
	'click #cardSetConfirm': function () {
		var id = this._id;

		$('#setCardsetFormModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteCardset", id);
			Router.go('create');
		}).modal('hide');
	},
	'click #acceptRequest': function () {
		Meteor.call("acceptProRequest", this._id);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.accepted'), 'success', 'growl-top-left');
		Router.go('home');
	},
	'click #declineRequest': function () {
		var reason = $('#declineRequestReason').val();
		if (reason === '') {
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.reason'), 'danger', 'growl-top-left');
		} else {
			Meteor.call("addNotification", this.owner, "Freischaltung des Kartensatzes " + this.name + " nicht stattgegeben", reason, this._id, TAPi18n.__('set-list.author'));
			Meteor.call("declineProRequest", this._id);
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.declined'), 'info', 'growl-top-left');
			Router.go('home');
		}
	},
	'click #backToCardsetDetailView, cllick #backToCardsetDetailViewFullscreen': function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	},
	'click .projectorIcon': function () {
		Router.go('presentation', {
			_id: Router.current().params._id
		});
	}
});
