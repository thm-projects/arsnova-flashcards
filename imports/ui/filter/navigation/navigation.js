//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Filter} from "../../../api/filter";
import {Cards} from "../../../api/cards";
import {Cardsets} from "../../../api/cardsets";
import {CardType} from "../../../api/cardTypes";
import {Route} from "../../../api/route";
import "./navigation.html";
import './item/resetButton.js';
import './item/sortResults.js';
import './item/filterAuthor.js';
import './item/filterCardType.js';
import './item/filterDifficulty.js';
import './item/filterBonus.js';
import './item/filterLecturerAuthorized.js';
import './item/filterRating.js';
import "./item/filterStars.js";
import './item/filterWordcloud.js';
import './item/filterKind.js';
import './item/filterTranscriptLecture.js';

/*
 * ############################################################################
 * filterNavigation
 * ############################################################################
 */

Template.filterNavigation.greeting = function () {
	return Session.get('authors');
};

Template.infiniteScroll.helpers({
	moreResults: function () {
		let query = Filter.getFilterQuery();
		if (Route.isTranscript() || Route.isTranscriptBonus()) {
			query.cardType = 2;
			return Filter.getMaxItemCounter() < Cards.find(query).count();
		} else {
			if (Session.get("selectingCardsetToLearn") && query.cardType === undefined) {
				if (Route.isRepetitorienFilterIndex()) {
					query.gotWorkload = true;
				} else {
					query.cardType = {$in: CardType.getCardTypesWithLearningModes()};
				}
			}
			return Filter.getMaxItemCounter() < Cardsets.find(query).count();
		}
	},
	getCurrentResults: function (shortVersion = false) {
		let query = Filter.getFilterQuery();
		if (Route.isTranscript() || Route.isTranscriptBonus()) {
			query.cardType = 2;
			Session.set('totalResults', Cards.find(query).count());
			if (shortVersion) {
				return TAPi18n.__('infinite-scroll.remainingShort', {
					current: Filter.getMaxItemCounter(),
					total: Session.get('totalResults')
				});
			} else {
				if (Route.isMyBonusTranscripts() || Route.isTranscriptBonus()) {
					return TAPi18n.__('infinite-scroll.remainingTranscriptsBonus', {
						current: Filter.getMaxItemCounter(),
						total: Session.get('totalResults')
					});
				} else {
					return TAPi18n.__('infinite-scroll.remainingTranscripts', {
						current: Filter.getMaxItemCounter(),
						total: Session.get('totalResults')
					});
				}
			}
		} else {
			if (Session.get("selectingCardsetToLearn") && query.cardType === undefined) {
				if (Route.isRepetitorienFilterIndex()) {
					query.gotWorkload = true;
				} else {
					query.cardType = {$in: CardType.getCardTypesWithLearningModes()};
				}
			}
			Session.set('totalResults', Cardsets.find(query).count());
			if (shortVersion) {
				return TAPi18n.__('infinite-scroll.remainingShort', {
					current: Filter.getMaxItemCounter(),
					total: Session.get('totalResults')
				});
			} else {
				if (Route.isRepetitorienFilterIndex()) {
					return TAPi18n.__('infinite-scroll.remainingReps', {
						current: Filter.getMaxItemCounter(),
						total: Session.get('totalResults')
					});
				} else {
					return TAPi18n.__('infinite-scroll.remainingCardsets', {
						current: Filter.getMaxItemCounter(),
						total: Session.get('totalResults')
					});
				}
			}
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
