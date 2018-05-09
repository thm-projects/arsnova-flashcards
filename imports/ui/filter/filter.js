//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {CourseIterations} from "../../api/courseIterations.js";
import "./filter.html";
import {getAuthorName} from "../../api/cardsetUserlist";

Meteor.subscribe("cardsets");
Meteor.subscribe("courseIterations");

export let items_increment = 6;

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAuthor');
Session.setDefault('poolFilterAudience');
Session.setDefault('poolFilterCardType');
Session.setDefault('poolFilterCollege');
Session.setDefault('poolFilterCourse');
Session.setDefault('poolFilterSemester');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilterModule', false);
Session.setDefault('poolFilterDifficulty', undefined);
Session.setDefault('poolFilterLearnphase', undefined);
Session.setDefault('poolFilterRating');
Session.setDefault('poolFilter', ["personal", "free", "edu", "pro"]);
Session.setDefault('selectedCardset');
Session.setDefault("itemsLimit", items_increment);

let filterQuery = {};
Session.setDefault('filterQuery', filterQuery);

function isPoolRoute() {
	return Router.current().route.getName() === "pool";
}

function isCreateRoute() {
	return Router.current().route.getName() === "create";
}

function isCourseIterationRoute() {
	return Router.current().route.getName() === "courseIterations";
}

function isLearnRoute() {
	return Router.current().route.getName() === "learn";
}

export function prepareQuery() {
	let query = {};
	query.kind = {$in: Session.get('poolFilter')};
	if (Session.get('poolFilterCardType') !== "" && Session.get('poolFilterCardType') !== undefined) {
		query.cardType = Session.get('poolFilterCardType');
	}
	if (Session.get('poolFilterAuthor')) {
		query.owner = Session.get('poolFilterAuthor');
	}
	if (Session.get('poolFilterTargetAudience')) {
		query.targetAudience = Session.get('poolFilterTargetAudience');
	}
	if (isCreateRoute()) {
		query.owner = Meteor.userId();
	}
	if (Session.get('poolFilterCollege')) {
		query.college = Session.get('poolFilterCollege');
	}
	if (Session.get('poolFilterCourse')) {
		query.course = Session.get('poolFilterCourse');
	}
	if (Session.get('poolFilterSemester')) {
		query.semester = Session.get('poolFilterSemester');
	}
	if (!Session.get('poolFilterNoModule')) {
		if (Session.get('poolFilterModule')) {
			query.moduleActive = true;
			query.module = Session.get('poolFilterModule');
		}
	} else {
		query.moduleActive = false;
	}
	if (Session.get('poolFilterDifficulty') !== undefined) {
		query.difficulty = Number(Session.get('poolFilterDifficulty'));
	}
	if (Session.get('poolFilterWordcloud') !== undefined) {
		query.wordcloud = Session.get('poolFilterWordcloud');
	}
	if (Session.get('poolFilterLearnphase') !== undefined) {
		query.learningActive = Session.get('poolFilterLearnphase');
	}
	Session.set('filterQuery', query);
}

export function checkRemainingCards() {
	prepareQuery();
	let query = Session.get('filterQuery');
	if (isLearnRoute() && Session.get('cardsetIdFilter') !== undefined) {
		query._id = {$in: Session.get('cardsetIdFilter')};
	}
	let totalResults;
	if (isCourseIterationRoute()) {
		totalResults = CourseIterations.find(query).count();
	} else {
		totalResults = Cardsets.find(query).count();
	}
	if (totalResults > Session.get("itemsLimit")) {
		$(".showMoreResults").data("visible", true);
		Session.set("totalResults", totalResults);
		return true;
	} else {
		$(".showMoreResults").data("visible", false);
		return false;
	}
}

export function resetInfiniteBar() {
	Session.set("itemsLimit", items_increment);
	checkRemainingCards();
}

export function filterCheckbox() {
	$("#filterCheckbox input:checkbox").each(function () {
		if (!Session.get('poolFilter').includes($(this).val())) {
			$(this).prop('checked', false);
			$(this).closest("label").removeClass('active');
		} else {
			$(this).prop('checked', true);
			$(this).closest("label").addClass('active');
		}
	});
}

export function checkFilters() {
	if (Session.get('poolFilterCardType')) {
		$(".filterCardTypeGroup").addClass('active');
	} else {
		$(".filterCardTypeGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterAuthor')) {
		$(".filterAuthorGroup").addClass('active');
	} else {
		$(".filterAuthorGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterCollege')) {
		$(".filterCollegeGroup").addClass('active');
	} else {
		$(".filterCollegeGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterCourse')) {
		$(".filterCourseGroup").addClass('active');
	} else {
		$(".filterCourseGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterModule')) {
		$(".filterModuleGroup").addClass('active');
	} else {
		$(".filterModuleGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterUpdatedDate')) {
		$(".filterUpdatedDateGroup").addClass('active');
	} else {
		$(".filterUpdatedDateGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterLearnphase')) {
		$(".filterLearnphase").addClass('active');
	} else {
		$(".filterLearnphase").removeClass('active').first();
	}
	filterCheckbox();
}

export function resetFilters() {
	Session.set('poolSortTopic', {name: 1});
	Session.set('poolFilterAuthor');
	Session.set('poolFilterTargetAudience');
	Session.set('poolFilterCardType');
	Session.set('poolFilterCollege');
	Session.set('poolFilterCourse');
	Session.set('poolFilterNoModule', false);
	Session.set('poolFilterModule');
	Session.set('poolFilterSemester');
	Session.set('poolFilterDifficulty', undefined);
	Session.set('poolFilterWordcloud', undefined);
	Session.set('poolFilterCreatedDate', undefined);
	Session.set('poolFilterUpdatedDate', undefined);
	if (isPoolRoute()) {
		Session.set('poolFilter', ["free", "edu", "pro"]);
	} else {
		Session.set('poolFilter', ["personal", "free", "edu", "pro"]);
	}
	Session.set('poolFilterLearnphase');
	Session.set('filterQuery', {});
	checkFilters();
	resetInfiniteBar();
}

export function filterCardType(event) {
	Session.set('poolFilterCardType', $(event.target).data('id'));
	resetInfiniteBar();
}

export function filterAuthor(event) {
	Session.set('poolFilterAuthor', $(event.target).data('id'));
	resetInfiniteBar();
}

export function filterTargetAudience(event) {
	Session.set('poolFilterTargetAudience', Number($(event.target).data('id')));
	resetInfiniteBar();
}

export function filterCollege(event) {
	Session.set('poolFilterCollege', $(event.target).data('id'));
	resetInfiniteBar();
}

export function filterCourse(event) {
	Session.set('poolFilterCourse', $(event.target).data('id'));
	resetInfiniteBar();
}

export function filterSemester(event) {
	Session.set('poolFilterSemester', Number($(event.target).data('id')));
	resetInfiniteBar();
}

export function filterModule(event) {
	Session.set('poolFilterModule', $(event.target).data('id'));
	resetInfiniteBar();
}


export function filterLearnphase(event) {
	let result = $(event.target).data('id');
	if (result === "reset") {
		Session.set('poolFilterLearnphase', undefined);
	} else {
		Session.set('poolFilterLearnphase', result);
	}

	resetInfiniteBar();
}

/*
 * ############################################################################
 * filterNavigation
 * ############################################################################
 */

Template.filterNavigation.events({
	'click #resetBtn': function () {
		resetFilters();
	},
	'click #resetBtnMobile': function () {
		resetFilters();
	},
	'click #topicBtn': function () {
		let sort = Session.get('poolSortTopic');
		if (sort.name === undefined || sort.name === 1) {
			Session.set('poolSortTopic', {name: -1});
		} else {
			Session.set('poolSortTopic', {name: 1});
		}
	},
	'click .filterAuthor': function (event) {
		resetInfiniteBar();
		filterAuthor(event);
	},
	'click .filterTargetAudience': function (event) {
		resetInfiniteBar();
		filterTargetAudience(event);
	},
	'click .filterCollege': function (event) {
		resetInfiniteBar();
		filterCollege(event);
	},
	'click .createdDateBtn': function () {
		let sort = Session.get('poolSortTopic');
		if (sort.date === undefined || sort.date === 1) {
			Session.set('poolSortTopic', {date: -1});
		} else {
			Session.set('poolSortTopic', {date: 1});
		}
	},
	'click .filterCourse': function (event) {
		resetInfiniteBar();
		filterCourse(event);
	},
	'click .filterSemester': function (event) {
		resetInfiniteBar();
		filterSemester(event);
	},
	'click .filterModule': function (event) {
		resetInfiniteBar();
		Session.set('poolFilterNoModule', false);
		filterModule(event);
	},
	'click .updatedDateBtn': function () {
		let sort = Session.get('poolSortTopic');
		if (sort.dateUpdated === undefined || sort.dateUpdated === 1) {
			Session.set('poolSortTopic', {dateUpdated: -1});
		} else {
			Session.set('poolSortTopic', {dateUpdated: 1});
		}
	},
	'click .filterNoModule': function () {
		resetInfiniteBar();
		Session.set('poolFilterNoModule', true);
	},
	'click .filterNoDifficulty': function () {
		resetInfiniteBar();
		Session.set('poolFilterDifficulty', undefined);
	},
	'click .filterNoWordcloud': function () {
		resetInfiniteBar();
		Session.set('poolFilterWordcloud', undefined);
	},
	'click .filterDifficulty': function (event) {
		resetInfiniteBar();
		Session.set('poolFilterDifficulty', $(event.target).data('id'));
	},
	'click .filterWordcloud': function (event) {
		resetInfiniteBar();
		Session.set('poolFilterWordcloud', $(event.target).data('id'));
	},
	'click .filterLearnphase': function () {
		resetInfiniteBar();
		filterLearnphase(event);
	},
	'change #filterCheckbox': function () {
		resetInfiniteBar();
		var filter = [];
		$("#filterCheckbox input:checkbox:checked").each(function () {
			filter.push($(this).val());
		});
		Session.set('poolFilter', filter);
	}
});

Template.filterNavigation.helpers({
	getSortTopicIcon: function () {
		switch (Session.get('poolSortTopic').name) {
			case 1:
				return '<i class="fa fa-sort-alpha-asc"></i>';
			case-1:
				return '<i class="fa fa-sort-alpha-desc"></i>';

		}
	},
	getSortCreatedDateIcon: function () {
		switch (Session.get('poolSortTopic').date) {
			case 1:
				return '<i class="fa fa-sort-numeric-asc"></i>';
			case-1:
				return '<i class="fa fa-sort-numeric-desc"></i>';

		}
	},
	getSortUpdatedDateIcon: function () {
		switch (Session.get('poolSortTopic').dateUpdated) {
			case 1:
				return '<i class="fa fa-sort-numeric-asc"></i>';
			case-1:
				return '<i class="fa fa-sort-numeric-desc"></i>';

		}
	},
	filterAuthors: function () {
		prepareQuery();
		let query = Session.get('filterQuery');
		query.owner = this._id;
		if (isCourseIterationRoute()) {
			return CourseIterations.findOne(query);
		} else {
			return Cardsets.findOne(query);
		}
	},
	getDifficulty: function () {
		prepareQuery();
		return _.uniq(Cardsets.find(Session.get('filterQuery'), {sort: {"difficulty": 1}}).fetch(), function (item) {
			return item.difficulty;
		});
	},
	getAuthors: function () {
		return Meteor.users.find({}, {fields: {_id: 1, profile: 1}, sort: {"profile.birthname": 1}}).fetch();
	},
	getColleges: function () {
		prepareQuery();
		if (isCourseIterationRoute()) {
			return _.uniq(CourseIterations.find(Session.get('filterQuery'), {sort: {"college": 1}}).fetch(), function (item) {
				return item.college;
			});
		} else {
			return _.uniq(Cardsets.find(Session.get('filterQuery'), {sort: {"college": 1}}).fetch(), function (item) {
				return item.college;
			});
		}
	},
	getCourses: function () {
		prepareQuery();
		let query = Session.get('filterQuery');
		query.moduleActive = true;
		if (isCourseIterationRoute()) {
			return _.uniq(CourseIterations.find(query, {sort: {"course": 1}}).fetch(), function (item) {
				return item.course;
			});
		} else {
			return _.uniq(Cardsets.find(query, {sort: {"course": 1}}).fetch(), function (item) {
				return item.course;
			});
		}
	},
	getModules: function () {
		prepareQuery();
		let query = Session.get('filterQuery');
		query.moduleActive = true;
		if (isCourseIterationRoute()) {
			return _.uniq(CourseIterations.find(query, {sort: {"module": 1}}).fetch(), function (item) {
				return item.moduleNum;
			});
		} else {
			return _.uniq(Cardsets.find(query, {sort: {"module": 1}}).fetch(), function (item) {
				return item.moduleNum;
			});
		}
	},
	getUpdatedDates: function () {
		return _.uniq(Cardsets.find(Session.get('filterQuery'), {sort: {"dateUpdated": -1}}).fetch(), function (item) {
			return moment(item.dateUpdated).format("DD.MM.YYYY");
		});
	},
	hasCardTypeFilter: function () {
		return Session.get('poolFilterCardType') !== "" && Session.get('poolFilterCardType') !== undefined;
	},
	hasCourseIterationFilter: function () {
		return false;
	},
	poolFilterCardType: function (cardType) {
		return Session.get('poolFilterCardType') === cardType;
	},
	hasAuthorFilter: function () {
		return Session.get('poolFilterAuthor');
	},
	poolFilterAuthor: function (id) {
		return Session.get('poolFilterAuthor') === id;
	},
	hasCollegeFilter: function () {
		return Session.get('poolFilterCollege');
	},
	hasCreatedDateFilter: function () {
		return Session.get('poolFilterCreatedDate');
	},
	hasUpdatedDateFilter: function () {
		return Session.get('poolFilterUpdatedDate');
	},
	poolFilterCollege: function (college) {
		return Session.get('poolFilterCollege') === college;
	},
	hasSemesterFilter: function () {
		return Session.get('poolFilterSemester');
	},
	hasTargetAudienceFilter: function () {
		return Session.get('poolFilterTargetAudience');
	},
	hasCourseFilter: function () {
		return Session.get('poolFilterCourse');
	},
	poolFilterCourse: function (course) {
		return Session.get('poolFilterCourse') === course;
	},
	hasModuleFilter: function () {
		return Session.get('poolFilterModule') || Session.get('poolFilterNoModule');
	},
	poolFilterModule: function (module) {
		return Session.get('poolFilterModule') === module;
	},
	getDifficultyName: function () {
		return TAPi18n.__('difficulty' + this.difficulty);
	},
	hasDifficultyFilter: function () {
		return Session.get('poolFilterDifficulty');
	},
	poolFilterDifficulty: function () {
		return Session.get('poolFilterDifficulty') === this.difficulty;
	},
	hasWordcloudFilter: function () {
		return Session.get('poolFilterWordcloud') !== undefined;
	},
	poolFilterWordcloud: function (inWordcloud) {
		if (Session.get('poolFilterWordcloud') !== undefined) {
			return Session.get('poolFilterWordcloud').toString() === inWordcloud;
		}
	},
	hasLearnphaseFilter: function () {
		return Session.get('poolFilterLearnphase') === true || Session.get('poolFilterLearnphase') === false;
	},
	poolFilterLearnphase: function (learningPhase) {
		return Session.get('poolFilterLearnphase') === learningPhase;
	},
	poolFilterCreatedDate: function (date) {
		if (Session.get('poolFilterCreatedDate')) {
			return moment(Session.get('poolFilterCreatedDate')).startOf('day').unix() === moment(date).startOf('day').unix();
		}
	},
	poolFilterUpdatedDate: function (dateUpdated) {
		if (Session.get('poolFilterUpdatedDate')) {
			return moment(Session.get('poolFilterUpdatedDate')).startOf('day').unix() === moment(dateUpdated).startOf('day').unix();
		}
	},
	selectingCardsetToLearn: function () {
		return Session.get('selectingCardsetToLearn');
	},
	getAuthorName: function () {
		return getAuthorName(this._id);
	}
});

Template.filterNavigation.greeting = function () {
	return Session.get('authors');
};

Template.infiniteScroll.helpers({
	moreResults: function () {
		return checkRemainingCards();
	},
	getCurrentResults: function () {
		if (isCourseIterationRoute()) {
			return TAPi18n.__('infinite-scroll.remainingCourses', {
				current: Session.get("itemsLimit"),
				total: Session.get("totalResults")
			});
		} else {
			return TAPi18n.__('infinite-scroll.remainingCardsets', {
				current: Session.get("itemsLimit"),
				total: Session.get("totalResults")
			});
		}
	}
});

Template.infiniteScroll.events({
	'click .showMoreResults': function () {
		Session.set("itemsLimit", Session.get("itemsLimit") + items_increment);
		checkRemainingCards();
	}
});
