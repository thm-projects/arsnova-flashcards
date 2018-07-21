import {Meteor} from "meteor/meteor";
import {FilterNavigation} from "./filterNavigation";
import {Session} from "meteor/session";
import {Cardsets} from "./cardsets";
import {CourseIterations} from "./courseIterations";
import {Route} from "./route";
import {Leitner, Wozniak} from "./learned";

let itemIncrementCounter = 6;
Session.setDefault('maxItemsCounter', itemIncrementCounter);
Session.setDefault('poolFilter', undefined);
Session.setDefault('myCardsetFilter', undefined);
Session.setDefault('courseIterationFilter', undefined);
Session.setDefault('workloadFilter', undefined);
Session.setDefault('allCardsetsFilter', undefined);
Session.setDefault('shuffleFilter', undefined);
let personalKindTag = "personal";
let eduKindTag = "edu";
let freeKindTag = "free";
let proKindTag = "pro";

export let Filter = class Filter {
	static getActiveFilter () {
		switch (FilterNavigation.getRouteId()) {
			case 0:
				if (Session.get('poolFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('poolFilter');
			case 1:
				if (Session.get('myCardsetFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('myCardsetFilter');
			case 2:
				if (Session.get('courseIterationFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('courseIterationFilter');
			case 3:
				if (Session.get('workloadFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('workloadFilter');
			case 4:
				if (Session.get('allCardsetsFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('allCardsetsFilter');
			case 5:
				if (Session.get('shuffleFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('shuffleFilter');
		}
	}

	static setActiveFilter (content, contentType = undefined) {
		let filter = content;
		if (contentType !== undefined) {
			filter = this.getActiveFilter();
			switch (contentType) {
				case "cardType":
					filter.cardType = content;
					break;
				case "difficulty":
					filter.difficulty = content;
					if (content !== undefined) {
						filter.noDifficulty = false;
					}
					break;
				case "author":
					filter.owner = content;
					break;
				case "course":
					filter.course = content;
					break;
				case "college":
					filter.college = content;
					break;
				case "module":
					filter.module = content;
					break;
				case "noDifficulty":
					filter.noDifficulty = content;
					break;
				case "noModule":
					filter.noModule = content;
					break;
				case "wordcloud":
					filter.wordcloud = content;
					break;
				case "bonus":
					filter.learningActive = content;
					break;
				case "kind":
					filter.kind = content;
					break;
				case "targetAudience":
					filter.targetAudience = content;
					break;
				case "semester":
					filter.semester = content;
					break;
				case "noSemester":
					filter.noSemester = content;
					break;
			}
		}
		switch (FilterNavigation.getRouteId()) {
			case 0:
				Session.set('poolFilter', filter);
				break;
			case 1:
				Session.set('myCardsetFilter', filter);
				break;
			case 2:
				Session.set('courseIterationFilter', filter);
				break;
			case 3:
				Session.set('workloadFilter', filter);
				break;
			case 4:
				Session.set('allCardsetsFilter', filter);
				break;
			case 5:
				Session.set('shuffleFilter', filter);
				break;
		}
		this.resetInfiniteBar();
	}

	static setDefaultFilter (filterType) {
		let filter = {};
		filter.topic = undefined;
		if (Route.isWorkload()) {
			let leitnerCards = Leitner.find({
				user_id: Meteor.userId()
			});

			let wozniakCards = Wozniak.find({
				user_id: Meteor.userId()
			});
			let learnCardsets = [];
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
			filter._id = {$in: learnCardsets};
		}
		if (Route.isMyCardsets() || FilterNavigation.gotAuthorFilter(filterType)) {
			if (Route.isMyCardsets()) {
				filter.owner = Meteor.userId();
			} else {
				filter.owner = undefined;
			}
		}
		if (FilterNavigation.gotCardTypeFilter(filterType)) {
			filter.cardType = undefined;
		}
		if (FilterNavigation.gotTargetAudienceFilter(filterType)) {
			filter.targetAudience = undefined;
		}
		if (FilterNavigation.gotCollegeFilter(filterType)) {
			filter.college = undefined;
			filter.noCollege = undefined;
		}
		if (FilterNavigation.gotCourseFilter(filterType)) {
			filter.course = undefined;
			filter.noCourse = undefined;
		}
		if (FilterNavigation.gotSemesterFilter(filterType)) {
			filter.semester = undefined;
			filter.noSemester = undefined;
		}
		if (FilterNavigation.gotModuleFilter(filterType)) {
			filter.module = undefined;
			filter.noModule = undefined;
		}
		if (FilterNavigation.gotDifficultyFilter(filterType)) {
			filter.difficulty = undefined;
			filter.noDifficulty = undefined;
		}
		if (FilterNavigation.gotBonusFilter(filterType)) {
			filter.learningActive = undefined;
		}
		if (FilterNavigation.gotWordCloudFilter(filterType)) {
			filter.wordcloud = undefined;
		}
		if (FilterNavigation.gotKindFilter(filterType)) {
			let kind = [];
			if (FilterNavigation.gotPersonalKindFilter(filterType)) {
				kind.push(this.getPersonalKindTag());
			}
			if (FilterNavigation.gotFreeKindFilter(filterType)) {
				kind.push(this.getFreeKindTag());
			}
			if (FilterNavigation.gotEduKindFilter(filterType)) {
				kind.push(this.getEduKindTag());
			}
			if (FilterNavigation.gotProKindFilter(filterType)) {
				kind.push(this.getProKindTag());
			}
			filter.kind = kind;
		} else {
			filter.kind = undefined;
		}
		if (FilterNavigation.gotDefaultSortName(filterType)) {
			filter.name = 1;
		}
		if (FilterNavigation.gotDefaultSortDateUpdated(filterType)) {
			filter.dateUpdated = -1;
		}
		filter.noModule = undefined;
		this.setActiveFilter(filter);
	}

	static getFilterQuery () {
		let query = {};
		let activeFilter = this.getActiveFilter();
		if (Route.isWorkload()) {
			query._id = activeFilter._id;
		}
		if (Route.isMyCardsets() || FilterNavigation.gotAuthorFilter(FilterNavigation.getRouteId()) && activeFilter.owner !== undefined) {
			query.owner = activeFilter.owner;
		}
		if (FilterNavigation.gotCardTypeFilter(FilterNavigation.getRouteId()) && activeFilter.cardType !== undefined) {
			query.cardType = activeFilter.cardType;
		}
		if (FilterNavigation.gotTargetAudienceFilter(FilterNavigation.getRouteId()) && activeFilter.targetAudience !== undefined) {
			query.targetAudience = activeFilter.targetAudience;
		}
		if (FilterNavigation.gotCollegeFilter(FilterNavigation.getRouteId()) && activeFilter.college !== undefined) {
			query.college = activeFilter.college;
		}
		if (FilterNavigation.gotCourseFilter(FilterNavigation.getRouteId()) && activeFilter.course !== undefined) {
			query.course = activeFilter.course;
		}
		if (FilterNavigation.gotSemesterFilter(FilterNavigation.getRouteId()) && activeFilter.semester !== undefined) {
			query.semester = activeFilter.semester;
		}
		if (FilterNavigation.gotSemesterFilter(FilterNavigation.getRouteId()) && activeFilter.noSemester !== undefined) {
			query.noSemester = activeFilter.noSemester;
		}
		if (FilterNavigation.gotModuleFilter(FilterNavigation.getRouteId()) && activeFilter.module !== undefined) {
			query.module = activeFilter.module;
		}
		if (FilterNavigation.gotModuleFilter(FilterNavigation.getRouteId()) && activeFilter.noModule !== undefined) {
			query.noModule = activeFilter.noModule;
		}
		if (FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId()) && activeFilter.difficulty !== undefined) {
			query.difficulty = activeFilter.difficulty;
		}
		if (FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId()) && activeFilter.noDifficulty !== undefined) {
			query.noDifficulty = activeFilter.noDifficulty;
		}
		if (FilterNavigation.gotBonusFilter(FilterNavigation.getRouteId()) && activeFilter.learningActive !== undefined) {
			query.learningActive = activeFilter.learningActive;
		}
		if (FilterNavigation.gotWordCloudFilter(FilterNavigation.getRouteId()) && activeFilter.wordcloud !== undefined) {
			query.wordcloud = activeFilter.wordcloud;
		}
		if (FilterNavigation.gotKindFilter(FilterNavigation.getRouteId()) && activeFilter.kind !== undefined) {
			query.kind = {$in: activeFilter.kind};
		}
		return query;
	}

	static resetActiveFilter () {
		this.setDefaultFilter(FilterNavigation.getRouteId());
	}

	static getPersonalKindTag () {
		return personalKindTag;
	}

	static getFreeKindTag () {
		return freeKindTag;
	}

	static getEduKindTag () {
		return eduKindTag;
	}

	static getProKindTag () {
		return proKindTag;
	}

	static getMaxItemCounter () {
		return Session.get('maxItemsCounter');
	}

	static resetMaxItemCounter () {
		Session.set('maxItemsCounter', itemIncrementCounter);
	}

	static incrementMaxItemCounter () {
		let newCounter = Session.get('maxItemsCounter');
		newCounter += itemIncrementCounter;
		Session.set('maxItemsCounter', newCounter);
	}

	static getSortFilter () {
		let filter = this.getActiveFilter();
		if (filter.name !== undefined) {
			return {name: filter.name};
		}
		if (filter.date !== undefined) {
			return {date: filter.name};
		}
		if (filter.dateUpdated !== undefined) {
			return {dateUpdated: filter.dateUpdated};
		}
	}

	static setSortFilter (type) {
		let filter = this.getActiveFilter();
		switch (type) {
			case 0:
				if (filter.name === undefined || filter.name === 1) {
					filter.name = -1;
				} else {
					filter.name = 1;
				}
				filter.date = undefined;
				filter.dateUpdated = undefined;
				break;
			case 1:
				if (filter.date === undefined || filter.date === 1) {
					filter.date = -1;
				} else {
					filter.date = 1;
				}
				filter.name = undefined;
				filter.dateUpdated = undefined;
				break;
			case 2:
				if (filter.dateUpdated === undefined || filter.dateUpdated === 1) {
					filter.dateUpdated = -1;
				} else {
					filter.dateUpdated = 1;
				}
				filter.name = undefined;
				filter.date = undefined;
				break;
		}
		this.setActiveFilter(filter);
	}

	static checkRemainingCards () {
		let query = Filter.getFilterQuery();
		if (Route.isWorkload() && Session.get('cardsetIdFilter') !== undefined) {
			query._id = {$in: Session.get('cardsetIdFilter')};
		}
		let totalResults;
		if (Route.isCourseIteration()) {
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

	static resetInfiniteBar () {
		this.resetMaxItemCounter();
		this.checkRemainingCards();
	}
};
