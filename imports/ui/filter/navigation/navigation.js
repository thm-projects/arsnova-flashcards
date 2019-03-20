//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Filter} from "../../../api/filter";
import {Cardsets} from "../../../api/cardsets";
import {CardType} from "../../../api/cardTypes";
import "./navigation.html";
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

});

Template.filterNavigation.greeting = function () {
	return Session.get('authors');
};

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
		Session.set('totalResults', Cardsets.find(query).count());
		return TAPi18n.__('infinite-scroll.remainingCardsets', {
			current: Filter.getMaxItemCounter(),
			total: Session.get('totalResults')
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
