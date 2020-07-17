import {Template} from "meteor/templating";
import {FilterNavigation} from "../../../../util/filterNavigation.js";
import "./resetButton.html";
import {Filter} from "../../../../util/filter";

/*
 * ############################################################################
 * filterItemResetButton
 * ############################################################################
 */

Template.filterItemResetButton.onRendered(function () {
	FilterNavigation.getFilterButton();
});


Template.filterItemResetButton.helpers({
	isDisabled: function () {
		return FilterNavigation.getFilterButton();
	}
});

Template.filterItemResetButton.events({
	'click .resetFilters': function () {
		Filter.resetActiveFilter();
	}
});
