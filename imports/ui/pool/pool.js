//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner} from "../../api/learned.js";
import "./pool.html";
import {
	filterAuthor,
	filterCardType,
	filterCollege,
	filterCheckbox,
	filterCourse,
	filterModule,
	resetFilters,
	prepareQuery
} from "../filter/filter.js";
import {getCardTypeName} from "../../api/cardTypes.js";

Meteor.subscribe("cardsets");

/*
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
	getDecks: function () {
		prepareQuery();
		return Cardsets.find(Session.get('filterQuery'), {sort: Session.get('poolSortTopic'), limit: Session.get('itemsLimit')});
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

Template.poolCardsetRow.helpers({
	isAlreadyLearning: function () {
		if (this.owner === Meteor.userId() || this.editors.includes(Meteor.userId())) {
			return true;
		}
		let learnedCards = Leitner.find({
			user_id: Meteor.userId()
		});
		let learnedCardsets = [];
		learnedCards.forEach(function (learnedCard) {
			if ($.inArray(learnedCard.cardset_id, learnedCardsets) === -1) {
				learnedCardsets.push(learnedCard.cardset_id);
			}
		});
		if (learnedCardsets.indexOf(this._id) != -1) {
			return true;
		} else {
			return false;
		}
	},
	getMaximumText: function (text) {
		const maxLength = 15;
		const textSplitted = text.split(" ");
		if (textSplitted.length > maxLength) {
			return textSplitted.slice(0, maxLength).toString().replace(/,/g, ' ') + "...";
		}
		return text;
	},
	gotDescription: function (text) {
		if (text !== "" && text !== undefined) {
			return true;
		}
	},
	getCardTypeName: function (cardType) {
		return getCardTypeName(cardType);
	}
});

Template.poolCardsetRow.events({
	'click .filterAuthor': function (event) {
		filterAuthor(event);
	},
	'click .filterCardType': function (event) {
		filterCardType(event);
	},
	'click .filterCollege': function (event) {
		filterCollege(event);
	},
	'click .filterCourse': function (event) {
		filterCourse(event);
	},
	'click .filterModule': function (event) {
		filterModule(event);
	},
	'click .filterCheckbox': function (event) {
		Session.set('poolFilter', [$(event.target).data('id')]);
		filterCheckbox();
	},
	'click .showLicense': function (event) {
		Session.set('selectedCardset', $(event.target).data('id'));
	},
	'click .poolText ': function (event) {
		Session.set('selectedCardset', $(event.target).data('id'));
	}
});

Template.pool.onCreated(function () {
	resetFilters();
});
