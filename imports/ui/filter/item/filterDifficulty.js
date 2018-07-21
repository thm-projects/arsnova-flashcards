import "./filterDifficulty.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";
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
		return Filter.getFilterQuery().noDifficulty === true;
	},
	displayNoDifficultyFilter: function () {
		let query = Filter.getFilterQuery();
		delete query.difficulty;
		query.noDifficulty = true;
		return Cardsets.findOne(query);
	},
	displayDifficultyFilterNumber: function (difficulty) {
		let query = Filter.getFilterQuery();
		query.difficulty = difficulty;
		query.noDifficulty = false;
		return Cardsets.findOne(query);
	},
	hasDifficultyFilterNumber: function (difficulty) {
		return Filter.getFilterQuery().difficulty === difficulty;
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
