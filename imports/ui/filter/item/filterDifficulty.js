import "./filterDifficulty.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";
import {CardType} from "../../../api/cardTypes";
import {Cardsets} from "../../../api/cardsets";

/*
 * ############################################################################
 * filterItemFilterDifficulty
 * ############################################################################
 */

Template.filterItemFilterDifficulty.helpers({
	hasDifficultyFilter: function () {
		return (Filter.getFilterQuery().difficulty !== undefined || Filter.getFilterQuery().noDifficulty !== undefined);
	},
	hasNoDifficultyFilter: function () {
		return Filter.getFilterQuery().noDifficulty !== undefined;
	},
	displayNoDifficultyFilter: function () {
		let query = Filter.getFilterQuery();
		delete query.difficulty;
		query.noDifficulty = true;
		return Cardsets.findOne(query);
	},
	getDifficulty: function () {
		let result;
		let query = Filter.getFilterQuery();
		delete query.difficulty;
		delete query.noDifficulty;
		result = _.uniq(Cardsets.find(query, {
			sort: {"difficulty": 1},
			fields: {"difficulty": 1}
		}).fetch(), function (item) {
			return item.difficulty;
		});
		query.cardType = {$nin: CardType.withDifficultyLevel()};
		query.shuffled = false;
		let noDifficultyResult = Cardsets.findOne(query, {fields: {"difficulty": 1}});
		if (noDifficultyResult !== undefined) {
			noDifficultyResult.difficulty = 0;
			result.unshift(noDifficultyResult);
		}
		return result;
	},
	resultsFilterDifficulty: function () {
		return Filter.getFilterQuery().difficulty === this.difficulty;
	},
	getDifficultyName: function () {
		return TAPi18n.__('difficulty' + this.difficulty);
	}
});

Template.filterItemFilterDifficulty.events({
	'click .noFilterDifficulty': function () {
		Filter.setActiveFilter(undefined, "difficulty");
		Filter.setActiveFilter(undefined, "noDifficulty");
	},
	'click .filterNoDifficulty': function () {
		Filter.setActiveFilter(undefined, "difficulty");
		Filter.setActiveFilter(true, "noDifficulty");
	},
	'click .filterDifficulty': function (event) {
		Filter.setActiveFilter(undefined, "noDifficulty");
		Filter.setActiveFilter($(event.target).data('id'), "difficulty");
	}
});
