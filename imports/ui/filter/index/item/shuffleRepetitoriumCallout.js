import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/cardsets";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import "./shuffleRepetitoriumCallout.html";

/*
 * ############################################################################
 * filterItemShuffleRepetitoriumCallout
 * ############################################################################
 */

Template.filterItemShuffleRepetitoriumCallout.helpers({
	gotShuffledCards: function () {
		if (ActiveRoute.name('shuffle')) {
			return Session.get("ShuffledCardsets").length > 0;
		} else {
			return true;
		}
	},
	displayRemoveButton: function () {
		return Session.get("ShuffledCardsets").length > 0;
	}
});

Template.filterItemShuffleRepetitoriumCallout.events({
	'click #updateShuffledCardset': function () {
		let removedCardsets = $(Cardsets.findOne({_id: Router.current().params._id}).cardGroups).not(Session.get("ShuffledCardsets")).get();
		Meteor.call("updateShuffleGroups", Router.current().params._id, Session.get("ShuffledCardsets"), removedCardsets, function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('set-list.shuffleUpdateFailure'), 'danger', 'growl-top-left');
			}
			if (result) {
				Session.set('activeCard', undefined);
				BertAlertVisuals.displayBertAlert(TAPi18n.__('set-list.shuffleUpdateSuccess'), 'success', 'growl-top-left');
				Router.go('cardsetdetailsid', {_id: Router.current().params._id});
			}
		});
	},
	'click #cancelUpdateShuffle': function () {
		Router.go('cardsetdetailsid', {_id: Router.current().params._id});
	},
	'click #removeShuffledCards': function () {
		Session.set("ShuffledCardsets", []);
	}
});
