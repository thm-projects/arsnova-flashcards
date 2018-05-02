//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "../cardset/cardset.js";
import {cleanModal} from "../forms/cardsetCourseIterationForm.js";
import "./cardsets.html";
import {
	prepareQuery,
	resetFilters
} from "../filter/filter";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);

Meteor.subscribe("cardsets");

/*
 * ############################################################################
 * create
 * ############################################################################
 */

Template.create.helpers({
	cardsetList: function () {
		prepareQuery();
		return Cardsets.find(Session.get('filterQuery'), {sort: Session.get('poolSortTopic'), limit: Session.get('itemsLimit')});
	}
});

Template.create.onCreated(function () {
	resetFilters();
	Session.set('moduleActive', true);
});

Template.create.onRendered(function () {
	cleanModal();
});

/*
 * ############################################################################
 * learn
 * ############################################################################
 */

Template.learn.helpers({
	learnList: function () {
		var leitnerCards = Leitner.find({
			user_id: Meteor.userId()
		});

		let wozniakCards = Wozniak.find({
			user_id: Meteor.userId()
		});
		var learnCardsets = [];
		leitnerCards.forEach(function (leitnerCard) {
			if ($.inArray(leitnerCard.cardset_id, learnCardsets) === -1) {
				learnCardsets.push(leitnerCard.cardset_id);
			}
		});

		wozniakCards.forEach(function (wozniakCard) {
			if ($.inArray(wozniakCard.cardset_id, learnCardsets) === -1) {
				learnCardsets.push(wozniakCard.cardset_id);
			}
		});
		prepareQuery();
		Session.set('cardsetIdFilter', learnCardsets);
		let query = Session.get('filterQuery');
		query._id = {$in: Session.get('cardsetIdFilter')};
		return Cardsets.find(query, {sort: Session.get('poolSortTopic'), limit: Session.get('itemsLimit')});
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

Template.learn.onCreated(function () {
	resetFilters();
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
				Bert.alert(TAPi18n.__('set-list.shuffleUpdateFailure'), 'danger', 'growl-top-left');
			}
			if (result) {
				Bert.alert(TAPi18n.__('set-list.shuffleUpdateSuccess'), 'success', 'growl-top-left');
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
	shuffleList: function () {
		if (Router.current().route.getName() === "editshuffle") {
			Session.set("ShuffledCardsets", Cardsets.findOne({_id: Router.current().params._id}).cardGroups);
		}
		return Cardsets.find({
			$or: [
				{owner: Meteor.userId()},
				{kind: {$in: ["free", "edu"]}}
			]
		}, {
			fields: {
				name: 1,
				description: 1,
				quantity: 1,
				cardType: 1,
				difficulty: 1,
				kind: 1,
				owner: 1
			},
			sort: {name: 1}
		});
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
				Bert.alert(TAPi18n.__('cardset.confirm-form-delete.failure'), "danger", 'growl-top-left');
			} else {
				Bert.alert(TAPi18n.__('cardset.confirm-form-delete.success'), "success", 'growl-top-left');
			}
			$('#confirmDeleteCardsetModal').modal('hide');
		});
	}
});
