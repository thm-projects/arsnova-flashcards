import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./shuffleRepetitoriumCallout.html";

/*
 * ############################################################################
 * filterItemShuffleRepetitoriumCallout
 * ############################################################################
 */

Template.filterItemShuffleRepetitoriumCallout.helpers({
	gotShuffledCards: function () {
		if (FlowRouter.getRouteName() === 'shuffle') {
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
		let removedCardsets = $(Cardsets.findOne({_id: FlowRouter.getParam('_id')}).cardGroups).not(Session.get("ShuffledCardsets")).get();
		Meteor.call("updateShuffleGroups", FlowRouter.getParam('_id'), Session.get("ShuffledCardsets"), removedCardsets, function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('set-list.shuffleUpdateFailure'), 'danger', 'growl-top-left');
			}
			if (result) {
				Session.set('activeCard', undefined);
				BertAlertVisuals.displayBertAlert(TAPi18n.__('set-list.shuffleUpdateSuccess'), 'success', 'growl-top-left');
				FlowRouter.go('cardsetdetailsid', {_id: FlowRouter.getParam('_id')});
			}
		});
	},
	'click #cancelUpdateShuffle': function () {
		FlowRouter.go('cardsetdetailsid', {_id: FlowRouter.getParam('_id')});
	},
	'click #removeShuffledCards': function () {
		Session.set("ShuffledCardsets", []);
	}
});
