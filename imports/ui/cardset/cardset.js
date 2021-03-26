//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/subscriptions/cardsets.js";
import {CardNavigation} from "../../util/cardNavigation";
import {BertAlertVisuals} from "../../util/bertAlertVisuals";
import {CardsetNavigation} from "../../util/cardsetNavigation";
import {Bonus} from "../../util/bonus";
import "../main/modal/arsnovaLite.js";
import "../main/modal/arsnovaClick.js";
import "../main/overlays/aspectRatio.js";
import "../markdeep/editor/navigation/navigation.js";
import "../markdeep/editor/content/content.js";
import "./navigation/modal/bonus/bonusForm.js";
import "../forms/cardsetForm.js";
import "./index/cards/cards.js";
import "./index/editors/editors.js";
import "./info/info.js";
import "./preview.js";
import "../learningStatistics/bonusStatistics.js";
import "./labels/labels.js";
import "./index/transcript/transcript.js";
import "./sidebar/sidebar.js";
import "../learn/progress.js";
import "../filter/filter.js";
import "./cardset.html";
import {PDFViewer} from "../../util/pdfViewer";

Meteor.subscribe("notifications");

/*
 * ############################################################################
 * cardset
 * ############################################################################
 */

Template.cardset.onCreated(function () {
	if (Session.get('activeCardset') === undefined || Session.get('activeCardset')._id !== FlowRouter.getParam('_id')) {
		Session.set('activeCardset', Cardsets.findOne(FlowRouter.getParam('_id')));
		Session.set('activeCard', undefined);
	}
	if (Number(Session.get('activeCard')) === Number(-1)) {
		Session.set('activeCard', undefined);
	}
	Session.set('shuffled', Cardsets.findOne(FlowRouter.getParam('_id')).shuffled);
	Session.set('cameFromEditMode', false);
	CardNavigation.toggleVisibility(true);
	Session.set('hideSidebar', false);
	PDFViewer.setAutoPDFTargetStatus(false);
});

Template.cardset.rendered = function () {
	if (Meteor.user()) {
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

							Meteor.call('btCreateTransaction', nonce, FlowRouter.getParam('_id'), function (transactionError) {
								if (transactionError) {
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
	}
	$('html, body').animate({scrollTop: '0px'}, 0);
};

Template.cardset.helpers({
	getCardset: function () {
		return Cardsets.findOne({_id: FlowRouter.getParam('_id')});
	},
	selectedForLearning: function () {
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
			FlowRouter.go('create');
		}).modal('hide');
	},
	'click #acceptRequest': function () {
		Meteor.call("acceptProRequest", this._id);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.accepted'), 'success', 'growl-top-left');
		FlowRouter.go('home');
	},
	'click #declineRequest': function () {
		var reason = $('#declineRequestReason').val();
		if (reason === '') {
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.reason'), 'danger', 'growl-top-left');
		} else {
			Meteor.call("addNotification", this.owner, "Freischaltung des Kartensatzes " + this.name + " nicht stattgegeben", reason, this._id, TAPi18n.__('set-list.author'));
			Meteor.call("declineProRequest", this._id);
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.declined'), 'info', 'growl-top-left');
			FlowRouter.go('home');
		}
	},
	'click #backToCardsetDetailView, cllick #backToCardsetDetailViewFullscreen': function () {
		FlowRouter.go('cardsetdetailsid', {
			_id: FlowRouter.getParam('_id')
		});
	},
	'click .projectorIcon': function () {
		FlowRouter.go('presentation', {
			_id: FlowRouter.getParam('_id')
		});
	}
});
