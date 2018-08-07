//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {FilterNavigation} from "../../api/filterNavigation";
import "./filter.html";
import './item/resetButton.js';
import './item/sortResults.js';
import './item/filterAuthor.js';
import './item/filterCardType.js';
import './item/filterDifficulty.js';
import './item/filterBonus.js';
import './item/filterWordcloud.js';
import './item/filterKind.js';
import {Filter} from "../../api/filter";
import {Cardsets} from "../../api/cardsets";

Meteor.subscribe("cardsets");

/*
 * ############################################################################
 * filterNavigation
 * ############################################################################
 */

Template.filterNavigation.helpers({
	gotResetButton: function () {
		return FilterNavigation.gotResetButton(FilterNavigation.getRouteId());
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
	},
	selectingCardsetToLearn: function () {
		return Session.get('selectingCardsetToLearn');
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
		return Filter.getMaxItemCounter() < Cardsets.find(Filter.getFilterQuery()).count();
	},
	getCurrentResults: function () {
		return TAPi18n.__('infinite-scroll.remainingCardsets', {
			current: Filter.getMaxItemCounter(),
			total: Cardsets.find(Filter.getFilterQuery()).count()
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
