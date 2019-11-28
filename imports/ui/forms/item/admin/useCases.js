import "./useCases.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

Template.cardsetFormAdminItemUseCases.helpers({
	isUseCase: function () {
		if (Session.get('activeCardset') !== undefined && Session.get('activeCardset').useCase !== undefined) {
			return Session.get('activeCardset').useCase.enabled;
		}
	}
});

Template.cardsetFormAdminItemUseCases.events({
	'click #cardsetAddUseCase': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateUseCaseStatus', Session.get('activeCardset')._id, true, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	},
	'click #cardsetRemoveUseCase': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateUseCaseStatus', Session.get('activeCardset')._id, false, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	}
});
