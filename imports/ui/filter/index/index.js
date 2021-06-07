//------------------------ IMPORTS

import {Template} from "meteor/templating";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Cards} from "../../../api/subscriptions/cards.js";
import {Cardsets} from "../../../api/subscriptions/cardsets.js";
import {Filter} from "../../../util/filter";
import {Route} from "../../../util/route";
import {FilterNavigation} from "../../../util/filterNavigation";
import {CardType} from "../../../util/cardTypes";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import {MainNavigation} from "../../../util/mainNavigation";
import {LoginTasks} from "../../../util/login";
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
import "./item/bottom/labels.js";
import "./item/bottom/navigation.js";
import "./item/bottom/item/aboutThisRating.js";
import "./item/bottom/item/bonusStats.js";
import "./item/bottom/item/collapse.js";
import "./item/bottom/item/deadline.js";
import "./item/bottom/item/delete.js";
import "./item/bottom/item/deleteTranscript.js";
import "./item/bottom/item/edit.js";
import "./item/bottom/item/editTranscript.js";
import "./item/bottom/item/export.js";
import "./item/bottom/item/leaveWorkload.js";
import "./item/bottom/item/shuffle.js";
import "./item/bottom/item/starsRating.js";
import "./item/bottom/item/learningStatus.js";
import "./item/bottom/item/learningHistory.js";
import "./item/bottom/item/transcriptRating.js";
import "./item/bottom/item";
import "./item/bottom/item/wordcloudButton";
import "./item/collapse/collapse.js";
import "./item/titleRow/author.js";
import "./item/titleRow/date.js";
import "./item/titleRow/topic.js";
import "./item/titleRow/lastEditor.js";
import "./item/titleRow/workload.js";
import "./item/top/author.js";
import "./item/top/date.js";
import "./item/top/lastEditor.js";
import "./item/top/topic.js";
import "./item/top/workload.js";
import "../modal/aboutThisRating.js";
import "../modal/deleteWorkload.js";
import "../modal/deleteCardset.js";
import "../modal/deleteTranscript.js";
import "../modal/selectWorkload.js";
import "./item/bottom/item/publish.js";
import "./item/bottom/item/license.js";
import "../../cardset/navigation/modal/bonus/leave/leave.js";
import "./index.html";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../util/styles";
import "../../messageOfTheDay/messageOfTheDay.js";
import {LeitnerLearningWorkload} from "../../../api/subscriptions/leitner/leitnerLearningWorkload";

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
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(true, "wordcloud");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-use-case': function () {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(true, "useCase");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-lecturer-authorized': function () {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(true, "lecturerAuthorized");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-kind': function (event) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter([$(event.target).data('id')], "kind");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-card-type': function (event) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(Number($(event.target).data('id')), "cardType");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-difficulty': function (event) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(Number($(event.target).data('id')), "difficulty");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-bonus': function () {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(true, "bonusActive");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-bonus-finished': function () {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(true, "bonusActive");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-bonus': function () {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(true, "transcriptBonus");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderAuthor a': function (event) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			if (Route.isTranscript() || Route.isTranscriptBonus()) {
				Filter.setActiveFilter($(event.target).data('id'), "user_id");
			} else {
				Filter.setActiveFilter($(event.target).data('id'), "author");
			}
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-rating': function (event) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter($(event.target).data('rating'), "rating");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-info': function (event) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter($(event.target).data('id'), "transcriptLecture");
			Filter.setActiveFilter($(event.target).data('cardset'), "cardset_id");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-transcript-rating-stars': function (evt) {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter($(evt.currentTarget).data("stars"), "stars");
			FilterNavigation.showDropdown();
		}
	},
	'click .resultItemHeaderBottomAreaLabels .label-shuffled': function () {
		if (ServerStyle.gotNavigationFeature("filter", true)) {
			Filter.setActiveFilter(undefined, "cardType");
			Filter.setActiveFilter(true, "shuffled");
			FilterNavigation.showDropdown();
		}
	}
});

Template.filterIndex.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	},
	displayedTranscriptNavigation: function () {
		return Route.isMyBonusTranscripts() || (Route.isMyTranscripts() && ServerStyle.gotSimplifiedNav());
	}
});

Template.filterIndex.onRendered(function () {
	Session.set('filterIndexSelectMode', undefined);
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
		return ServerStyle.gotNavigationFeature("public.cardset.wordcloud") && FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});

Template.filterIndexPool.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		FlowRouter.go('learn');
	}
});

Template.filterIndexPool.onRendered(function () {
	if (Session.get('useCaseType') === 3) {
		MainNavigation.focusSearchBar();
		Session.set('useCaseType', 0);
	} else if (!Session.get("selectingCardsetToLearn")) {
		FilterNavigation.setAutoOpenFeature();
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
		return ServerStyle.gotNavigationFeature("personal.cardset.wordcloud") && FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});


Template.filterIndexCreate.onRendered(function () {
	if (Route.isMyCardsets()) {
		if (Session.get('useCaseType') === 1) {
			$('#setCardsetFormModal').modal('show');
		}
	} else if (Route.isAllCardsets()) {
		FilterNavigation.setAutoOpenFeature();
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
		return ServerStyle.gotNavigationFeature("public.repetitorium.wordcloud") && FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId()) && Session.get('filterDisplayWordcloud');
	}
});

Template.filterIndexRepetitorium.onRendered(function () {
	if (Session.get('useCaseType') === 2) {
		MainNavigation.focusSearchBar();
		Session.set('useCaseType', 0);
	} else if (!Session.get("selectingCardsetToLearn")) {
		FilterNavigation.setAutoOpenFeature();
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
				return (LeitnerLearningWorkload.find({
					user_id: Meteor.userId(),
					isActive: true
				}).count() > 0 || Wozniak.find({user_id: Meteor.userId()}).count() > 0);
			case 1:
				return Cardsets.find(query, {
					sort: Filter.getSortFilter(),
					limit: Filter.getMaxItemCounter()
				}).count();
			case 2:
				let results = Cardsets.find(query, {sort: Filter.getSortFilter(), limit: Filter.getMaxItemCounter()});
				let filteredResults = [];
				results.forEach(function (cardset) {
					let workload = LeitnerLearningWorkload.findOne({
						cardset_id: cardset._id,
						user_id: Meteor.userId(),
						isActive: true});
					if (workload !== undefined || Wozniak.find({cardset_id: cardset._id, user_id: Meteor.userId()}).count() > 0) {
						cardset.workload_id = workload._id;
						cardset.isBonus = workload.isBonus;
						filteredResults.push(cardset);
					}
				});
				return filteredResults;
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
				return Cardsets.find(query, {limit: Filter.getMaxItemCounter()}).count();
			case 2:
				return Cardsets.find(query, {sort: Filter.getSortFilter(), limit: Filter.getMaxItemCounter()});
		}
	},
	isActiveCardset: function () {
		return this._id === FlowRouter.getParam('_id');
	}
});

Template.filterIndexShuffle.onCreated(function () {
	Session.set('shuffleFilter', undefined);
	if (Route.isEditShuffle()) {
		Session.set("ShuffledCardsets", Cardsets.findOne({_id: FlowRouter.getParam('_id')}).cardGroups);
	} else {
		Session.set("ShuffledCardsets", []);
	}
	Session.set("ShuffledCardsetsExclude", []);
});
