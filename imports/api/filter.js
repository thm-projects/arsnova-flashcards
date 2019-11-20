import {Meteor} from "meteor/meteor";
import {FilterNavigation} from "./filterNavigation";
import {Session} from "meteor/session";
import {Route} from "./route";
import {WordcloudCanvas} from "./wordcloudCanvas";
import {Leitner} from "./subscriptions/leitner";
import {Wozniak} from "./subscriptions/wozniak";
import * as config from "../config/filter.js";
import {TranscriptBonus} from "./subscriptions/transcriptBonus";

Session.setDefault('maxItemsCounter', config.itemStartingValue);
Session.setDefault('poolFilter', undefined);
Session.setDefault('myCardsetFilter', undefined);
Session.setDefault('courseIterationFilter', undefined);
Session.setDefault('repetitoriumFilter', undefined);
Session.setDefault('workloadFilter', undefined);
Session.setDefault('allCardsetsFilter', undefined);
Session.setDefault('allRepetitorienFilter', undefined);
Session.setDefault('personalRepetitorienFilter', undefined);
Session.setDefault('transcriptsPersonalFilter', undefined);
Session.setDefault('transcriptsBonusFilter', undefined);
Session.setDefault('transcriptsBonusCardsetFilter', undefined);
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
			case 8:
				if (Session.get('personalTranscriptsFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('personalTranscriptsFilter');
			case 9:
				if (Session.get('transcriptsBonusFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('transcriptsBonusFilter');
			case 10:
				if (Session.get('transcriptsBonusCardsetFilter') === undefined) {
					this.setDefaultFilter(FilterNavigation.getRouteId());
				}
				return Session.get('transcriptsBonusCardsetFilter');
		}
	}

	static setActiveFilter (content, contentType = undefined, maxItemCounter = config.itemStartingValue) {
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
					if (content !== undefined) {
						filter.name = undefined;
						filter.date = undefined;
						filter.dateUpdated = -1;
					}
					break;
				case "noDifficulty":
					filter.noDifficulty = content;
					break;
				case "wordcloud":
					filter.wordcloud = content;
					break;
				case "lecturerAuthorized":
					filter.lecturerAuthorized = content;
					break;
				case "noBonus":
					delete filter.learningActive;
					delete filter['transcriptBonus.enabled'];
					break;
				case "bonusActive":
					filter.learningActive = true;
					delete filter['transcriptBonus.enabled'];
					break;
				case "kind":
					filter.kind = content;
					break;
				case "_id":
					filter._id = content;
					break;
				case "cardset_id":
					filter.cardset_id = content;
					break;
				case "user_id":
					filter.user_id = content;
					break;
				case "transcriptBonus":
					delete filter.learningActive;
					filter['transcriptBonus.enabled'] = true;
					break;
				case "transcriptLecture":
					filter.transcriptDate = content;
					break;
				case "rating":
					if (content === undefined) {
						delete filter.rating;
					} else {
						filter.rating = Number(content);
						if (filter.rating !== 1) {
							delete filter.stars;
						}
					}
					break;
				case "stars":
					if (content === undefined) {
						delete filter.stars;
					} else {
						filter.stars = Number(content);
						filter.rating = Number(1);
					}
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
			case 8:
				Session.set('transcriptsPersonalFilter', filter);
				break;
			case 9:
				Session.set('transcriptsBonusFilter', filter);
				break;
			case 10:
				Session.set('transcriptsBonusCardsetFilter', filter);
				break;
		}
		this.setMaxItemCounter(maxItemCounter);
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
		}
		if (FilterNavigation.gotBonusFilter(FilterNavigation.getRouteId()) && activeFilter['transcriptBonus.enabled'] !== undefined) {
			query['transcriptBonus.enabled'] = activeFilter['transcriptBonus.enabled'];
		}
		if (FilterNavigation.gotWordCloudFilter(FilterNavigation.getRouteId()) && activeFilter.wordcloud !== undefined) {
			query.wordcloud = activeFilter.wordcloud;
		}
		if (FilterNavigation.gotLecturerAuthorizedFilter(FilterNavigation.getRouteId()) && activeFilter.lecturerAuthorized !== undefined) {
			query.lecturerAuthorized = activeFilter.lecturerAuthorized;
		}
		if (FilterNavigation.gotKindFilter(FilterNavigation.getRouteId()) && activeFilter.kind !== undefined) {
			query.kind = {$in: activeFilter.kind};
		}
		if (!Route.isWorkload() && activeFilter !== undefined && !Route.isTranscript() && !Route.isTranscriptBonus()) {
			query.shuffled = activeFilter.shuffled;
		}
		if (FilterNavigation.gotRatingFilter(FilterNavigation.getRouteId()) || FilterNavigation.gotTranscriptLectureFilter(FilterNavigation.getRouteId()) || FilterNavigation.gotStarsFilter(FilterNavigation.getRouteId())) {
			let ratingQuery = {};
			if (activeFilter.rating !== undefined) {
				ratingQuery.rating = activeFilter.rating;
			}
			if (activeFilter.user_id !== undefined) {
				ratingQuery.user_id = activeFilter.user_id;
			}
			if (activeFilter.stars !== undefined) {
				ratingQuery.stars = {$gte: activeFilter.stars};
			}
			if (activeFilter.cardset_id !== undefined) {
				ratingQuery.cardset_id = activeFilter.cardset_id;
			}
			if (activeFilter.transcriptDate !== undefined) {
				ratingQuery.date = new Date(activeFilter.transcriptDate);
			}
			let cardsWithRating = _.uniq(TranscriptBonus.find(ratingQuery, {
				fields: {card_id: 1}
			}).fetch().map(function (x) {
				return x.card_id;
			}), true);
			if (cardsWithRating.length) {
				query._id = {$in: cardsWithRating};
			}
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

	static setMaxItemCounter (size) {
		Session.set('maxItemsCounter', size);
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
		Session.set('transcriptsPersonalFilter', undefined);
		Session.set('transcriptsBonusFilter', undefined);
		Session.set('transcriptsBonusCardsetFilter', undefined);
	}
};
