import {Template} from "meteor/templating";
import {FilterNavigation} from "../../../../api/filterNavigation.js";
import "./resetButton.html";

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
