import {Meteor} from "meteor/meteor";
import {FilterNavigation} from "./filterNavigation";
import {Session} from "meteor/session";
import {Route} from "./route";
import {WordcloudCanvas} from "./wordcloudCanvas";
import {Leitner, Wozniak} from "./learned";
import * as config from "../config/filter.js";

Session.setDefault('maxItemsCounter', config.itemStartingValue);
Session.setDefault('poolFilter', undefined);
Session.setDefault('myCardsetFilter', undefined);
Session.setDefault('courseIterationFilter', undefined);
Session.setDefault('repetitoriumFilter', undefined);
Session.setDefault('workloadFilter', undefined);
Session.setDefault('allCardsetsFilter', undefined);
Session.setDefault('allRepetitorienFilter', undefined);
Session.setDefault('personalRepetitorienFilter', undefined);
Session.setDefault('shuffleFilter', undefined);
let personalKindTag = "personal";
let eduKindTag = "edu";
let freeKindTag = "free";
let proKindTag = "pro";

export let Filter = class Filter {
	static getActiveFilter (_id = undefined) {
		let route;
		if (_id === undefined) {
			route = FilterNavigation.getRouteId();
		} else {
			route = _id;
		}
		switch (route) {
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
				if (Session.get('repetitoriumFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('repetitoriumFilter');
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
			case 6:
				if (Session.get('allRepetitorienFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('allRepetitorienFilter');
			case 7:
				if (Session.get('personalRepetitorienFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('personalRepetitorienFilter');
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
				case "noDifficulty":
					filter.noDifficulty = content;
					break;
				case "wordcloud":
					filter.wordcloud = content;
					break;
				case "noBonus":
					filter.learningActive = undefined;
					filter.learningEnd = undefined;
					break;
				case "bonusActive":
					filter.learningActive = true;
					filter.learningEnd = {$gt: true};
					break;
				case "bonusFinished":
					filter.learningActive = true;
					filter.learningEnd = {$lte: true};
					break;
				case "kind":
					filter.kind = content;
					break;
				case "_id":
					filter._id = content;
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
				Session.set('repetitoriumFilter', filter);
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
			case 6:
				Session.set('allRepetitorienFilter', filter);
				break;
			case 7:
				Session.set('personalRepetitorienFilter', filter);
				break;
		}
		this.resetInfiniteBar();
		if (FilterNavigation.isDisplayWordcloudActive(FilterNavigation.getRouteId())) {
			WordcloudCanvas.draw();
		}
	}

	static workloadFilter () {
		let learnCardsets = [];
		let leitnerCards = Leitner.find({
			user_id: Meteor.userId()
		}, {fields: {cardset_id: 1}});

		let wozniakCards = Wozniak.find({
			user_id: Meteor.userId()
		}, {fields: {cardset_id: 1}});
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
		return learnCardsets;
	}

	static updateWorkloadFilter () {
		this.setActiveFilter(this.workloadFilter(), "_id");
	}

	static getDefaultFilter () {
		return this.setDefaultFilter(FilterNavigation.getRouteId(), true);
	}

	static setDefaultFilter (filterType, returnDefault = false) {
		let filter = {};
		if (Route.isWorkload()) {
			filter._id = this.workloadFilter();
		}
		if (Route.isMyCardsets() || FilterNavigation.gotAuthorFilter(filterType)) {
			if (Route.isMyCardsets()) {
				filter.owner = Meteor.userId();
			}
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
		}
		if (FilterNavigation.gotDefaultSortName(filterType)) {
			filter.name = 1;
		}
		if (FilterNavigation.gotDefaultSortDateUpdated(filterType)) {
			filter.dateUpdated = -1;
		}
		if (FilterNavigation.gotDefaultSortDateCreated(filterType)) {
			filter.date = -1;
		}
		if (!Route.isWorkload()) {
			filter.shuffled = Route.isRepetitorienFilterIndex();
		}
		if (returnDefault) {
			return filter;
		} else {
			this.setActiveFilter(filter);
		}
	}

	static getFilterQuery () {
		let query = {};
		let activeFilter = this.getActiveFilter();
		if (Route.isWorkload()) {
			query._id = {$in: activeFilter._id};
		} else {
			if (Session.get("selectingCardsetToLearn")) {
				let learnFilter = this.getActiveFilter(3);
				query._id = {$nin: learnFilter._id};
			}
		}
		if (Route.isMyCardsets() || FilterNavigation.gotAuthorFilter(FilterNavigation.getRouteId()) && activeFilter.owner !== undefined) {
			query.owner = activeFilter.owner;
		}
		if (FilterNavigation.gotCardTypeFilter(FilterNavigation.getRouteId()) && activeFilter.cardType !== undefined) {
			query.cardType = activeFilter.cardType;
		}
		if (FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId()) && activeFilter.difficulty !== undefined) {
			query.difficulty = activeFilter.difficulty;
		}
		if (FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId()) && activeFilter.noDifficulty !== undefined) {
			query.noDifficulty = activeFilter.noDifficulty;
		}
		if (FilterNavigation.gotBonusFilter(FilterNavigation.getRouteId()) && activeFilter.learningActive !== undefined) {
			query.learningActive = activeFilter.learningActive;
			if (activeFilter.learningEnd.$lte !== undefined) {
				query.learningEnd = {$lte: new Date()};
			} else {
				query.learningEnd = {$gt: new Date()};
			}
		}
		if (FilterNavigation.gotWordCloudFilter(FilterNavigation.getRouteId()) && activeFilter.wordcloud !== undefined) {
			query.wordcloud = activeFilter.wordcloud;
		}
		if (FilterNavigation.gotKindFilter(FilterNavigation.getRouteId()) && activeFilter.kind !== undefined) {
			query.kind = {$in: activeFilter.kind};
		}
		if (!Route.isWorkload() && activeFilter !== undefined) {
			query.shuffled = activeFilter.shuffled;
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
		Session.set('maxItemsCounter', config.itemStartingValue);
	}

	static incrementMaxItemCounter () {
		let newCounter = Session.get('maxItemsCounter');
		newCounter += config.itemIncrementValue;
		if ((Session.get('totalResults') - newCounter) <= (config.itemIncrementValue / 2)) {
			newCounter += config.itemIncrementValue;
		}
		Session.set('maxItemsCounter', newCounter);
	}

	static getSortFilter () {
		let filter = this.getActiveFilter();
		if (filter !== undefined) {
			if (filter.name !== undefined) {
				return {name: filter.name};
			}
			if (filter.date !== undefined) {
				return {date: filter.date};
			}
			if (filter.dateUpdated !== undefined) {
				return {dateUpdated: filter.dateUpdated};
			}
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

	static resetInfiniteBar () {
		this.resetMaxItemCounter();
	}

	static resetFilters () {
		Session.set('maxItemsCounter', config.itemStartingValue);
		Session.set('poolFilter', undefined);
		Session.set('myCardsetFilter', undefined);
		Session.set('courseIterationFilter', undefined);
		Session.set('repetitoriumFilter', undefined);
		Session.set('workloadFilter', undefined);
		Session.set('allCardsetsFilter', undefined);
		Session.set('shuffleFilter', undefined);
		Session.set('allRepetitorienFilter', undefined);
		Session.set('personalRepetitorienFilter', undefined);
	}
};
