import "./filterCardType.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterCardType
 * ############################################################################
 */

Template.filterItemFilterCardType.helpers({
	hasCardTypeFilter: function () {
		return Filter.getFilterQuery().cardType !== undefined;
	}
});

Template.filterItemFilterCardType.events({
	'click .noFilterCardType': function () {
		Filter.setActiveFilter(undefined, "cardType");
	},
	'click .filterCardType': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "cardType");
	}
});
