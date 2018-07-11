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
		return Filter.getFilterQuery().difficulty !== undefined;
	},
	getDifficulty: function () {
		let result;
		let query = Filter.getFilterQuery();
		delete query.difficulty;
		query.cardType = {$in: CardType.withDifficultyLevel()};
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
	},
	'click .filterDifficulty': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "difficulty");
	}
});
