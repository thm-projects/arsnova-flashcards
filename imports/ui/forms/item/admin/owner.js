import "./owner.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

Template.cardsetFormAdminItemOwner.onRendered(function () {
	$('#setCardsetFormAdminModal').on('show.bs.modal', function () {
		$('#cardsetChangeOwnerAdminLabel').html("");
	});
});

Template.cardsetFormAdminItemOwner.helpers({
	getOwnerId: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').owner;
		}
	},
	getAuthorLabel: function () {
		return TAPi18n.__('modal-dialog.cardsetowner');
	}
});

Template.cardsetFormAdminItemOwner.events({
	'click #cardsetChangeOwnerAdmin': function (evt, tmpl) {
		let owner = tmpl.find('#editOwnerAdmin').value;
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('changeOwner', Session.get('activeCardset')._id, owner, function (error, result) {
				if (error || result === false) {
					$('#cardsetChangeOwnerAdminLabel').css({'visibility': 'visible', 'color': '#b94a48'});
					$('#cardsetChangeOwnerAdminLabel').html(TAPi18n.__('modal-admin-dialog.owner.message.failure', {owner: TAPi18n.__('modal-dialog.cardsetowner')}));
				} else {
					$('#cardsetChangeOwnerAdminLabel').css({'visibility': 'visible', 'color': '#4ab948'});
					$('#cardsetChangeOwnerAdminLabel').html(TAPi18n.__('modal-admin-dialog.owner.message.success', {owner: TAPi18n.__('modal-dialog.cardsetowner')}));
					Session.set('activeCardset', Cardsets.findOne(Session.get('activeCardset')._id));
				}
				Meteor.subscribe('frontendUserData');
			});
		}
	}
});
