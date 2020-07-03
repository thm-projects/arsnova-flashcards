//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import "./publish.html";

function cleanUp() {
	let cardset = Session.get('activeCardset');

	$('#publishKind label').removeClass('active');
	$('#publishKind  label  input').filter(function () {
		return this.value === cardset.kind;
	}).parent().addClass('active');

	$('#publishKind  label  input').filter(function () {
		return this.value === cardset.kind;
	}).prop('checked', true);
	$('#publishPrice').val(cardset.price);
}

/*
 * ############################################################################
 * cardsetPublishForm
 * ############################################################################
 */

Template.cardsetPublishForm.onRendered(function () {
	$('#publishModal').on('hidden.bs.modal', function () {
		cleanUp();
	});
	$('#publishModal').on('show.bs.modal', function () {
		cleanUp();
	});
});

Template.cardsetPublishForm.helpers({
	getCardsetTitle: function () {
		return Session.get('activeCardset').name;
	}
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
				price = Session.get('activeCardset').price;
			}
		}
		if (kind === 'personal') {
			visible = false;
			Meteor.call('updateLicense', Session.get('activeCardset')._id, license);
		}
		if (kind === 'pro') {
			visible = false;
			Meteor.call("makeProRequest", Session.get('activeCardset')._id);

			let text = "Kartensatz " + Session.get('activeCardset').name + " zur Überprüfung freigegeben";
			let type = "Kartensatz-Freigabe";
			let target = "lecturer";

			Meteor.call("addNotification", target, type, text, Session.get('activeCardset')._id, "lecturer");

			license.push("by");
			license.push("nd");
			Meteor.call("updateLicense", Session.get('activeCardset')._id, license);
			BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.request.alert'), 'success', 'growl-top-left');
		}

		Meteor.call("publishCardset", Session.get('activeCardset')._id, kind, price, visible);
		$('#publishModal').modal('hide');
	}
});

/*
 * ############################################################################
 * publishKind
 * ############################################################################
 */

Template.publishKind.helpers({
	getActiveCardset: function () {
		return Session.get('activeCardset');
	},
	kindWithPrice: function () {
		return Session.get('kindWithPrice');
	},
	kindIsActive: function (kind) {
		return kind === this.kind;
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
