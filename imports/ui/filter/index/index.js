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
import "./item/bottom/aboutThisRating.js";
import "./item/bottom/bonusStats.js";
import "./item/bottom/collapse.js";
import "./item/bottom/deadline.js";
import "./item/bottom/delete.js";
import "./item/bottom/deleteTranscript.js";
import "./item/bottom/edit.js";
import "./item/bottom/editTranscript.js";
import "./item/bottom/export.js";
import "./item/bottom/leaveWorkload.js";
import "./item/bottom/shuffle.js";
import "./item/bottom/workloadProgress.js";
import "./item/bottom/transcriptRating.js";
import "./item/collapse/collapse.js";
import "./item/titleRow/author.js";
import "./item/titleRow/dateCreated.js";
import "./item/titleRow/dateModified.js";
import "./item/titleRow/topic.js";
import "./item/titleRow/workload.js";
import "./item/top/author.js";
import "./item/top/dateCreated.js";
import "./item/top/dateModified.js";
import "./item/top/topic.js";
import "./item/top/workload.js";
import "../modal/aboutThisRating.js";
import "../modal/deleteWorkload.js";
import "../modal/deleteCardset.js";
import "../modal/deleteTranscript.js";
import "../modal/selectWorkload.js";
import "./index.html";
import {Meteor} from "meteor/meteor";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);
Session.setDefault('transcriptViewingMode', 2);

/*
 * ############################################################################
 * filterIndex
 * ############################################################################
 */

Template.filterIndex.events({
	'click .resultItemHeaderBottomAreaLabels .label-wordcloud': function () {
		Filter.setActiveFilter(true, "wordcloud");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-lecturer-authorized': function () {
		Filter.setActiveFilter(true, "lecturerAuthorized");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-kind': function (event) {
		Filter.setActiveFilter([$(event.target).data('id')], "kind");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-card-type': function (event) {
		Filter.setActiveFilter(Number($(event.target).data('id')), "cardType");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-difficulty': function (event) {
		Filter.setActiveFilter(Number($(event.target).data('id')), "difficulty");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-bonus': function () {
		Filter.setActiveFilter(true, "bonusActive");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-bonus': function () {
		Filter.setActiveFilter(true, "transcriptBonus");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderAuthor a': function (event) {
		if (Route.isTranscript() || Route.isTranscriptBonus()) {
			Filter.setActiveFilter($(event.target).data('id'), "user_id");
		} else {
			Filter.setActiveFilter($(event.target).data('id'), "author");
		}
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-rating': function (event) {
		Filter.setActiveFilter($(event.target).data('rating'), "rating");
		FilterNavigation.showDropdown();
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-info': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "transcriptLecture");
		Filter.setActiveFilter($(event.target).data('cardset'), "cardset_id");
		FilterNavigation.showDropdown();
	}
});

Template.filterIndex.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	}
});


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
