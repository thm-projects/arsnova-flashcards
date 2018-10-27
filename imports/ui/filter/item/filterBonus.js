import "./filterBonus.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";
import {Cardsets} from "../../../api/cardsets";

/*
 * ############################################################################
 * filterItemFilterBonus
 * ############################################################################
 */

Template.filterItemFilterBonus.helpers({
	hasBonusFilter: function () {
		return Filter.getFilterQuery().learningActive !== undefined;
	},
	resultsFilterBonus: function (bonusType) {
		let query = Filter.getFilterQuery();
		switch (bonusType) {
			case 0:
				return (query.learningActive !== undefined && query.learningEnd.$gt !== undefined);
			case 1:
				return (query.learningActive !== undefined && query.learningEnd.$lte !== undefined);
		}
	},
	gotBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		query.learningActive = true;
		query.learningEnd = {$gt: new Date()};
		return Cardsets.findOne(query);
	},
	gotFinishedBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		query.learningActive = true;
		query.learningEnd = {$lte: new Date()};
		return Cardsets.findOne(query);
	}
});

Template.filterItemFilterBonus.events({
	'click .noFilterBonus': function () {
		Filter.setActiveFilter(undefined, "noBonus");
	},
	'click .filterActiveBonus': function () {
		Filter.setActiveFilter(undefined, "bonusActive");
	},
	'click .filterFinishedBonus': function () {
		Filter.setActiveFilter(undefined, "bonusFinished");
	}
});
