//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./publish.html";

/*
 * ############################################################################
 * cardsetPublishForm
 * ############################################################################
 */

Template.cardsetPublishForm.onRendered(function () {
	$('#publishModal').on('hidden.bs.modal', function () {
		var cardset = Cardsets.findOne(FlowRouter.getParam('_id'));

		$('#publishKind > label').removeClass('active');
		$('#publishKind > label > input').filter(function () {
			return this.value === cardset.kind;
		}).parent().addClass('active');

		$('#publishKind > label > input').filter(function () {
			return this.value === cardset.kind;
		}).prop('checked', true);

		$('#publishPrice').val(cardset.price);
	});
});

Template.cardsetPublishForm.events({
	'shown.bs.modal #publishModal': function () {
		Session.set('kindWithPrice', false);
	},
	'hidden.bs.modal #publishModal': function () {
		Session.set('kindWithPrice', false);
	},
	'click #cardsetPublish': function (evt, tmpl) {
		let kind = tmpl.find('#publishKind .active > input').value;
		let price = 0;
		let visible = true;
		let license = [];

		if (kind === 'edu' || kind === 'pro') {
			if (tmpl.find('#publishPrice') !== null) {
				price = tmpl.find('#publishPrice').value;
			} else {
				price = this.price;
			}
		}
		if (kind === 'personal') {
			visible = false;
			Meteor.call('updateLicense', FlowRouter.getParam('_id'), license);
		}
		if (kind === 'pro') {
			visible = false;
			Meteor.call("makeProRequest", FlowRouter.getParam('_id'));

			let text = "Kartensatz " + this.name + " zur Überprüfung freigegeben";
			let type = "Kartensatz-Freigabe";
			let target = "lecturer";

			Meteor.call("addNotification", target, type, text, FlowRouter.getParam('_id'), "lecturer");

			license.push("by");
			license.push("nd");
			Meteor.call("updateLicense", FlowRouter.getParam('_id'), license);
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.alert'), 'success', 'growl-top-left');
		}

		Meteor.call("publishCardset", FlowRouter.getParam('_id'), kind, price, visible);
		$('#publishModal').modal('hide');
	}
});

/*
 * ############################################################################
 * publishKind
 * ############################################################################
 */

Template.publishKind.helpers({
	kindWithPrice: function () {
		return Session.get('kindWithPrice');
	},
	kindIsActive: function (kind) {
		if (kind === 'personal' && this.kind === undefined) {
			return true;
		} else {
			return kind === this.kind;
		}
	},
	priceIsSelected: function (price) {
		return price === this.price ? 'selected' : '';
	}
});

Template.publishKind.events({
	'change #publishKind': function () {
		var kind = $('#publishKind input[name=kind]:checked').val();
		var kindWithPrice = (kind === 'edu' || kind === 'pro');
		Session.set('kindWithPrice', kindWithPrice);
	}
});
