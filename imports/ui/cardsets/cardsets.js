//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import "../cardset/cardset.js";
import {cleanModal} from "../forms/cardsetCourseIterationForm.js";
import "./cardsets.html";
import {Filter} from "../../api/filter";
import {BertAlertVisuals} from "../../api/bertAlertVisuals";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);

Meteor.subscribe("cardsets");

/*
 * ############################################################################
 * create
 * ############################################################################
 */

Template.create.helpers({
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
	}
});

Template.create.events({
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

Template.create.onDestroyed(function () {
	Filter.resetMaxItemCounter();
});

/*
 * ############################################################################
 * learn
 * ############################################################################
 */

Template.learn.helpers({
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

Template.learn.events({
	'click .deleteLearned': function (event) {
		Session.set('cardsetId', $(event.target).data('id'));
	},
	'click #browseCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('pool');
	}
});

/*
 * ############################################################################
 * shuffle
 * ############################################################################
 */

Template.shuffle.events({
	'click #createShuffledCardset': function () {
		Session.set("ShuffleTemplate", Cardsets.findOne({_id: Session.get("ShuffledCardsets")[0]}));
		cleanModal();
	},
	'click #updateShuffledCardset': function () {
		let removedCardsets = $(Cardsets.findOne({_id: Router.current().params._id}).cardGroups).not(Session.get("ShuffledCardsets")).get();
		Meteor.call("updateShuffleGroups", Router.current().params._id, Session.get("ShuffledCardsets"), removedCardsets, function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('set-list.shuffleUpdateFailure'), 'danger', 'growl-top-left');
			}
			if (result) {
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

Template.shuffle.helpers({
	shuffleInfoText: function () {
		return TAPi18n.__('set-list.shuffleInfoText');
	},
	shuffleList: function (resultType) {
		if (Router.current().route.getName() === "editshuffle") {
			Session.set("ShuffledCardsets", Cardsets.findOne({_id: Router.current().params._id}).cardGroups);
		}

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

Template.shuffle.created = function () {
	Session.set("ShuffledCardsets", []);
	Session.set("ShuffledCardsetsExclude", []);
};

/*
 * ############################################################################
 * cardsets
 * ############################################################################
 */

Template.cardsets.onCreated(function () {
	Session.set("selectingCardsetToLearn", false);
});

/*
 * ############################################################################
 * cardsetsConfirmLearnForm
 * ############################################################################
 */

Template.cardsetsConfirmLearnForm.events({
	'click #learnDelete': function () {
		$('#confirmLearnModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", Session.get('cardsetId'));
			Meteor.call("deleteWozniak", Session.get('cardsetId'));
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * selectModeForm
 * ############################################################################
 */

Template.selectModeForm.events({
	'click #learnBox': function () {
		$('#selectModeToLearnModal').on('hidden.bs.modal', function () {
			Session.set("workloadFullscreenMode", true);
			Router.go('box', {
				_id: Session.get("activeCardset")
			});
		}).modal('hide');
	},
	'click #learnMemo': function () {
		$('#selectModeToLearnModal').on('hidden.bs.modal', function () {
			Session.set("workloadFullscreenMode", true);
			Router.go('memo', {
				_id: Session.get("activeCardset")
			});
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * cardsetDeleteForm
 * ############################################################################
 */

Template.cardsetDeleteForm.events({
	'click #deleteCardset': function () {
		Meteor.call("deleteCardset", Session.get('cardsetId'), (error) => {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.failure'), "danger", 'growl-top-left');
			} else {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.confirm-form-delete.success'), "success", 'growl-top-left');
			}
			$('#confirmDeleteCardsetModal').modal('hide');
		});
	}
});
