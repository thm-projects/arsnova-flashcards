//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {FilterNavigation} from "../../../api/filterNavigation";
import {Filter} from "../../../api/filter";
import {Cardsets} from "../../../api/cardsets";
import {CardType} from "../../../api/cardTypes";
import "./navigation.html";
import './item/displayModeButton.js';
import './item/resetButton.js';
import './item/sortResults.js';
import './item/filterAuthor.js';
import './item/filterCardType.js';
import './item/filterDifficulty.js';
import './item/filterBonus.js';
import './item/filterWordcloud.js';
import './item/filterKind.js';

/*
 * ############################################################################
 * filterNavigation
 * ############################################################################
 */

Template.filterNavigation.helpers({
	gotResetButton: function () {
		return FilterNavigation.gotResetButton(FilterNavigation.getRouteId());
	},
	gotDisplayModeButton: function () {
		return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId());
	},
	gotSortButton: function () {
		return FilterNavigation.gotSortButton(FilterNavigation.getRouteId());
	},
	gotAuthorFilter: function () {
		return FilterNavigation.gotAuthorFilter(FilterNavigation.getRouteId());
	},
	gotCardTypeFilter: function () {
		return FilterNavigation.gotCardTypeFilter(FilterNavigation.getRouteId());
	},
	gotDifficultyFilter: function () {
		return FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId());
	},
	gotBonusFilter: function () {
		return FilterNavigation.gotBonusFilter(FilterNavigation.getRouteId());
	},
	gotWordcloudFilter: function () {
		return FilterNavigation.gotWordCloudFilter(FilterNavigation.getRouteId());
	},
	gotKindFilter: function () {
		return FilterNavigation.gotKindFilter(FilterNavigation.getRouteId());
	}
});

Template.filterNavigation.greeting = function () {
	return Session.get('authors');
};

Template.filterNavigation.events({
	'click .resetFilters': function () {
		Filter.resetActiveFilter();
	}
});

Template.infiniteScroll.helpers({
	moreResults: function () {
		let query = Filter.getFilterQuery();
		if (Session.get("selectingCardsetToLearn") && query.cardType === undefined) {
			query.cardType = {$in: CardType.getCardTypesWithLearningModes()};
		}
		return Filter.getMaxItemCounter() < Cardsets.find(query).count();
	},
	getCurrentResults: function () {
		let query = Filter.getFilterQuery();
		if (Session.get("selectingCardsetToLearn") && query.cardType === undefined) {
			query.cardType = {$in: CardType.getCardTypesWithLearningModes()};
		}
		return TAPi18n.__('infinite-scroll.remainingCardsets', {
			current: Filter.getMaxItemCounter(),
			total: Cardsets.find(query).count()
		});
	}
});

/*
 * ############################################################################
 * infiniteScroll
 * ############################################################################
 */

Template.infiniteScroll.events({
	'click .showMoreResults': function () {
		Filter.incrementMaxItemCounter();
	}
});
