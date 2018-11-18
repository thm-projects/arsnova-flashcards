//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import {Filter} from "../../../api/filter";
import {Route} from "../../../api/route";
import {BertAlertVisuals} from "../../../api/bertAlertVisuals";
import {SweetAlertMessages} from "../../../api/sweetAlert";
import {Profile} from "../../../api/profile";
import {FilterNavigation} from "../../../api/filterNavigation";
import {firstLoginBertAlert} from "../../../startup/client/routes";
import "./item/cardset.js";
import "../modal/deleteWorkload.js";
import "../modal/deleteCardset.js";
import "../modal/selectWorkload.js";
import "./index.html";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);


/*
 * ############################################################################
 * filterIndexPool
 * ############################################################################
 */

Template.filterIndexPool.helpers({
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

Template.filterIndexPool.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		Router.go('learn');
	}
});

Template.filterIndexPool.onRendered(function () {
	firstLoginBertAlert();
});

/*
 * ############################################################################
 * filterIndexCreate
 * ############################################################################
 */

Template.filterIndexCreate.helpers({
	cardsetList: function (returnType) {
		let query = {};
		if (returnType !== 0) {
			query = Filter.getFilterQuery();
		}

		switch (returnType) {
			case 0:
			case 1:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				});
		}
	},
	isProfileComplete: function () {
		return Profile.isCompleted();
	},
	displayWordcloud: function () {
		return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});

Template.filterIndexCreate.events({
	'click #newCardSet': function () {
		if (Profile.isCompleted()) {
			Session.set('isNewCardset', true);
			$('#setCardsetFormModal').modal('show');
		} else {
			SweetAlertMessages.completeProfile();
		}
	},
	'click #importCardsetCompleteProfile': function () {
		SweetAlertMessages.completeProfile();
	},
	'change #importCardset': function (evt) {
		if (Session.get('importCards') === undefined) {
			if (evt.target.files[0].name.match(/\.(json)$/)) {
				let reader = new FileReader();
				reader.onload = function () {
					let res;
					if (this.result.charAt(0) === '[' && this.result.charAt(this.result.length - 1) === ']') {
						res = $.parseJSON(this.result);
					} else {
						res = $.parseJSON('[' + this.result + ']');
					}
					let isCardset = true;
					if (!res[0].name) {
						Session.set('importCards', res);
						$("#newCardSet").click();
						isCardset = false;
					}
					if (isCardset) {
						Meteor.call('importCardset', res, function (error, result) {
							if (error) {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.failure'), 'danger', 'growl-top-left');
							}
							if (result) {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.success.cardset'), 'success', 'growl-top-left');
								Router.go('cardsetdetailsid', {
									_id: result
								});
							}
						});
					}
				};
				reader.readAsText(evt.target.files[0]);
			}
		}
	}
});

Template.filterIndexCreate.onDestroyed(function () {
	Filter.resetMaxItemCounter();
});

/*
 * ############################################################################
 * filterIndexRepetitorium
 * ############################################################################
 */

Template.filterIndexRepetitorium.helpers({
	cardsetList: function (returnType) {
		let query = {};
		if (returnType !== 0) {
			query = Filter.getFilterQuery();
		}

		switch (returnType) {
			case 0:
			case 1:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				});
		}
	},
	selectingCardsetToLearn: function () {
		return Session.get('selectingCardsetToLearn');
	},
	displayWordcloud: function () {
		return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});

Template.filterIndexRepetitorium.events({
	'click #newRepetitorium': function () {
		if (Profile.isCompleted()) {
			Session.set('isNewCardset', true);
			$('#setCardsetFormModal').modal('show');
		} else {
			SweetAlertMessages.completeProfile();
		}
	}
});

Template.filterIndexRepetitorium.onDestroyed(function () {
	Filter.resetMaxItemCounter();
});

/*
 * ############################################################################
 * filterIndexWorkload
 * ############################################################################
 */

Template.filterIndexWorkload.onCreated(function () {
	Filter.updateWorkloadFilter();
});

Template.filterIndexWorkload.helpers({
	learnList: function (returnType) {
		let query = {};
		if (returnType !== 0) {
			query = Filter.getFilterQuery();
		}
		switch (returnType) {
			case 0:
			case 1:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				return Cardsets.find(query, {sort: Filter.getSortFilter(), limit: Filter.getMaxItemCounter()});
		}
	}
});

Template.filterIndexWorkload.events({
	'click .deleteLearned': function (event) {
		Session.set('cardsetId', $(event.target).data('id'));
	},
	'click #browseCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('pool');
	},
	'click #browseShuffledCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('repetitorium');
	}
});

Template.filterIndexWorkload.onDestroyed(function () {
	Filter.resetMaxItemCounter();
});

/*
 * ############################################################################
 * filterIndexShuffle
 * ############################################################################
 */

Template.filterIndexShuffle.events({
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

Template.filterIndexShuffle.helpers({
	selectShuffleCardset: function () {
		return Session.get('selectingCardsetToLearn');
	},
	shuffleInfoText: function () {
		return TAPi18n.__('set-list.shuffleInfoText');
	},
	shuffleList: function (resultType) {
		let query = Filter.getFilterQuery();
		switch (resultType) {
			case 0:
			case 1:
				return Cardsets.find(query, {
					fields: {
						name: 1,
						description: 1,
						quantity: 1,
						cardType: 1,
						difficulty: 1,
						kind: 1,
						owner: 1
					},
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				return Cardsets.find(query, {
					fields: {
						name: 1,
						description: 1,
						quantity: 1,
						cardType: 1,
						difficulty: 1,
						kind: 1,
						owner: 1
					},
					sort: Filter.getSortFilter(), limit: Filter.getMaxItemCounter()
				});
		}
	},
	gotShuffledCards: function () {
		if (ActiveRoute.name('shuffle')) {
			return Session.get("ShuffledCardsets").length > 0;
		} else {
			return true;
		}
	},
	displayRemoveButton: function () {
		return Session.get("ShuffledCardsets").length > 0;
	},
	isActiveCardset: function () {
		return this._id === Router.current().params._id;
	}
});

Template.filterIndexShuffle.onCreated(function () {
	if (Route.isEditShuffle()) {
		Session.set("ShuffledCardsets", Cardsets.findOne({_id: Router.current().params._id}).cardGroups);
	} else {
		Session.set("ShuffledCardsets", []);
	}
	Session.set("ShuffledCardsetsExclude", []);
});

/*
 * ############################################################################
 * filterIndex
 * ############################################################################
 */

Template.filterIndex.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		Router.go('learn');
	}
});
