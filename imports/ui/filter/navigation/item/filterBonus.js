import "./filterBonus.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../api/filter";
import {Cardsets} from "../../../../api/cardsets";

/*
 * ############################################################################
 * filterItemFilterBonus
 * ############################################################################
 */

Template.filterItemFilterBonus.helpers({
	hasBonusFilter: function () {
		let query = Filter.getFilterQuery();
		return (query.learningActive !== undefined) || (query['transcriptBonus.enabled'] === true);
	},
	resultsFilterBonus: function (bonusType) {
		let query = Filter.getFilterQuery();
		switch (bonusType) {
			case 0:
				return (query.learningActive !== undefined);
			case 1:
				return (query['transcriptBonus.enabled'] === true);
		}
	},
	gotBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		query.learningActive = true;
		delete query['transcriptBonus.enabled'];
		return Cardsets.findOne(query);
	},
	gotTranscriptBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		delete query.learningActive;
		query['transcriptBonus.enabled'] = true;
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
	'click .filterTranscriptBonus': function () {
		Filter.setActiveFilter(true, "transcriptBonus");
	}
});
