import "./filterCardType.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterCardType
 * ############################################################################
 */

Template.filterItemFilterCardType.helpers({
	hasCardTypeFilter: function () {
		return Filter.getFilterQuery().cardType !== undefined || Filter.getFilterQuery().shuffled === true;
	}
});

Template.filterItemFilterCardType.events({
	'click .noFilterCardType': function () {
		Filter.setActiveFilter(undefined, "cardType");
		Filter.setActiveFilter(undefined, "shuffled");
	},
	'click .filterCardType': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "cardType");
		Filter.setActiveFilter(undefined, "shuffled");
	},
	'click .shuffleFilterCardType': function () {
		Filter.setActiveFilter(undefined, "cardType");
		Filter.setActiveFilter(true, "shuffled");
	}
});
