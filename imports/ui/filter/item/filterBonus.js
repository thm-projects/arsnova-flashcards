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
	resultsFilterBonus: function (bonus) {
		return Filter.getFilterQuery().learningActive === bonus;
	},
	gotBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		query.learningActive = true;
		return Cardsets.findOne(query);
	},
	gotNoBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		query.learningActive = false;
		return Cardsets.findOne(query);
	}
});

Template.filterItemFilterBonus.events({
	'click .noFilterBonus': function () {
		Filter.setActiveFilter(undefined, "bonus");
	},
	'click .filterBonus': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "bonus");
	}
});
