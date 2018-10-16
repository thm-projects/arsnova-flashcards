//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import "./pool.html";
import {firstLoginBertAlert} from "../../startup/client/routes";
import {Filter} from "../../api/filter";
import {FilterNavigation} from "../../api/filterNavigation";

Meteor.subscribe("cardsets");

/*
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
	getDecks: function (resultType) {
		let query = {};
		if (resultType !== 0) {
			query = Filter.getFilterQuery();
		}
		switch (resultType) {
			case 0:
			case 1:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				return Cardsets.find(query, {sort: Filter.getSortFilter(), limit: Filter.getMaxItemCounter()});
		}
	},
	displayWordcloud: function () {
		return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});

Template.category.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		Router.go('learn');
	}
});

Template.enterActiveLearnphaseModal.events({
	'click #enterActiveLearnphaseConfirm': function () {
		if (Session.get('selectedCardset')) {
			$('#enterActiveLearnphaseModal').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
			$('#enterActiveLearnphaseModal').on('hidden.bs.modal', function () {
				Router.go('cardsetdetailsid', {
					_id: Session.get('selectedCardset')
				});
			});
		}
	}
});

Template.showLicense.helpers({
	getTopic: function () {
		if (Session.get('selectedCardset')) {
			var item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return item.name;
		}
	},
	getLicenseCount: function () {
		if (Session.get('selectedCardset')) {
			var item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return (item.license.length > 0);
		}
	},
	getLicenseType: function (type) {
		if (Session.get('selectedCardset')) {
			var item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return (item.license.includes(type));
		}
	}
});

Template.pool.onRendered(function () {
	firstLoginBertAlert();
});
