import "./filterBonus.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../util/filter";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {BONUS_STATUS} from "../../../../config/cardset";

/*
 * ############################################################################
 * filterItemFilterBonus
 * ############################################################################
 */

Template.filterItemFilterBonus.helpers({
	hasBonusFilter: function () {
		let query = Filter.getFilterQuery();
		return (query._id !== undefined) || (query['transcriptBonus.enabled'] === true);
	},
	resultsFilterBonus: function (bonusType) {
		let query = Filter.getFilterQuery();
		switch (bonusType) {
			case 0:
				return (query._id !== undefined);
			case 1:
				return (query['transcriptBonus.enabled'] === true);
		}
	},
	gotBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		delete query['transcriptBonus.enabled'];
		delete query._id;
		query.bonusStatus = {$in: [
			BONUS_STATUS.PLANNED,
			BONUS_STATUS.ONGOING_OPEN,
			BONUS_STATUS.ONGOING_CLOSED,
			BONUS_STATUS.FINISHED
		]};
		return Cardsets.find(query).count();
	},
	gotTranscriptBonusCardsets: function () {
		let query = Filter.getFilterQuery();
		delete query.learningActive;
		delete query._id;
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
