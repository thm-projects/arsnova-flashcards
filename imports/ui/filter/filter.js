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
import './item/filterCollege.js';
import './item/filterCourse.js';
import './item/filterDifficulty.js';
import './item/filterModule.js';
import './item/filterBonus.js';
import './item/filterWordcloud.js';
import './item/filterKind.js';
import './item/filterTargetAudience.js';
import './item/filterSemester.js';
import {Filter} from "../../api/filter";
import {Route} from "../../api/route";
import {CourseIterations} from "../../api/courseIterations";
import {Cardsets} from "../../api/cardsets";

Meteor.subscribe("cardsets");
Meteor.subscribe("courseIterations");

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
	gotCollegeFilter: function () {
		return FilterNavigation.gotCollegeFilter(FilterNavigation.getRouteId());
	},
	gotCourseFilter: function () {
		return FilterNavigation.gotCourseFilter(FilterNavigation.getRouteId());
	},
	gotDifficultyFilter: function () {
		return FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId());
	},
	gotModuleFilter: function () {
		return FilterNavigation.gotModuleFilter(FilterNavigation.getRouteId());
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
	gotTargetAudienceFilter: function () {
		return FilterNavigation.gotTargetAudienceFilter(FilterNavigation.getRouteId());
	},
	gotSemesterFilter: function () {
		return FilterNavigation.gotSemesterFilter(FilterNavigation.getRouteId());
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
		if (Route.isCourseIteration()) {
			return Filter.getMaxItemCounter() < CourseIterations.find(Filter.getFilterQuery()).count();
		} else {
			return Filter.getMaxItemCounter() < Cardsets.find(Filter.getFilterQuery()).count();
		}
	},
	getCurrentResults: function () {
		if (Route.isCourseIteration()) {
			return TAPi18n.__('infinite-scroll.remainingCourses', {
				current: Filter.getMaxItemCounter(),
				total: CourseIterations.find(Filter.getFilterQuery()).count()
			});
		} else {
			return TAPi18n.__('infinite-scroll.remainingCardsets', {
				current: Filter.getMaxItemCounter(),
				total: Cardsets.find(Filter.getFilterQuery()).count()
			});
		}
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
