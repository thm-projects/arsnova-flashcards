//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../../api/cards.js";
import {Cardsets} from "../../../api/cardsets.js";
import {Filter} from "../../../api/filter";
import {Route} from "../../../api/route";
import {FilterNavigation} from "../../../api/filterNavigation";
import {CardType} from "../../../api/cardTypes";
import {Leitner, Wozniak} from "../../../api/learned";
import {MainNavigation} from "../../../api/mainNavigation";
import {LoginTasks} from "../../../api/login";
import "./item/card.js";
import "./item/cardset.js";
import "./item/createCardsetButton.js";
import "./item/createTranscriptButton.js";
import "./item/createRepetitoriumButton.js";
import "./item/importCardsetButton.js";
import "./item/selectCardsetButton.js";
import "./item/selectRepetitoriumButton.js";
import "./item/shuffleRepetitoriumCallout.js";
import "./item/selectCardsetToLearnCallout.js";
import "../modal/deleteWorkload.js";
import "../modal/deleteCardset.js";
import "../modal/deleteTranscript.js";
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
		if (Session.get("selectingCardsetToLearn") && query.cardType === undefined) {
			query.cardType = {$in: CardType.getCardTypesWithLearningModes()};
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
	if (Session.get('useCaseType') === 3) {
		MainNavigation.focusSearchBar();
		Session.set('useCaseType', 0);
	}
	LoginTasks.showUseCasesModal();
});


/*
 * ############################################################################
 * filterIndexTranscripts
 * ############################################################################
 */

Template.filterIndexTranscripts.helpers({
	getCards: function (resultType) {
		let query = {};
		if (resultType !== 0) {
			query = Filter.getFilterQuery();
		}
		query.cardType = 2;
		switch (resultType) {
			case 0:
			case 1:
				return Cards.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				return Cards.find(query, {sort: Filter.getSortFilter(), limit: Filter.getMaxItemCounter()});
		}
	}
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
				if (Route.isMyCardsets()) {
					return Cardsets.find(query).count() > 0;
				}
				return true;
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
	displayWordcloud: function () {
		return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});


Template.filterIndexCreate.onRendered(function () {
	if (Route.isMyCardsets()) {
		if (Session.get('useCaseType') === 1) {
			$('#setCardsetFormModal').modal('show');
		}
	}
	LoginTasks.showUseCasesModal();
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
	displayWordcloud: function () {
		return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});

Template.filterIndexRepetitorium.onRendered(function () {
	if (Session.get('useCaseType') === 2) {
		MainNavigation.focusSearchBar();
		Session.set('useCaseType', 0);
	}
	LoginTasks.showUseCasesModal();
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
	Session.set('hideSidebar', false);
});

Template.filterIndexWorkload.onRendered(function () {
	LoginTasks.showUseCasesModal();
});

Template.filterIndexWorkload.helpers({
	learnList: function (returnType) {
		let query = {};
		if (returnType !== 0) {
			query = Filter.getFilterQuery();
		}
		switch (returnType) {
			case 0:
				return (Leitner.find({user_id: Meteor.userId()}).count() > 0 || Wozniak.find({user_id: Meteor.userId()}).count() > 0);
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

Template.filterIndexShuffle.helpers({
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
	isActiveCardset: function () {
		return this._id === Router.current().params._id;
	}
});

Template.filterIndexShuffle.onCreated(function () {
	Session.set('shuffleFilter', undefined);
	if (Route.isEditShuffle()) {
		Session.set("ShuffledCardsets", Cardsets.findOne({_id: Router.current().params._id}).cardGroups);
	} else {
		Session.set("ShuffledCardsets", []);
	}
	Session.set("ShuffledCardsetsExclude", []);
});
