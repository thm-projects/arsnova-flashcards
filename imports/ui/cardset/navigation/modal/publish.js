//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import "./publish.html";

Session.setDefault('activeKind', 'personal');

function cleanUp() {
	let cardset = Session.get('activeCardset');

	Session.set('activeKind', cardset.kind);
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
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').name;
		}
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

		Meteor.call("publishCardset", Session.get('activeCardset')._id, kind, price, visible, function (err, res) {
			if (res) {
				Session.set('activeCardset', Cardsets.findOne({_id: Session.get('activeCardset')._id}));
			}
		});
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
		return kind === Session.get('activeKind');
	},
	priceIsSelected: function (price) {
		return price === this.price ? 'selected' : '';
	}
});

Template.publishKind.events({
	'click .kind-option': function (event) {
		Session.set('activeKind', $(event.currentTarget).data('id'));
	}
});
