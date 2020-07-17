import {FilterNavigation} from "../../../../../util/filterNavigation";
import {Template} from "meteor/templating";
import "./filter.html";

/*
* ############################################################################
* mainNavigationTopItemFilterDropdown
* ############################################################################
*/

let filterResizeSensor;
Template.mainNavigationTopItemFilterDropdown.events({
	'click .toggle-filter-dropdown': function () {
		FilterNavigation.showDropdown(false);
	}
});

Template.mainNavigationTopItemFilterDropdown.onRendered(function () {
	filterResizeSensor = $(window).resize(function () {
		FilterNavigation.setMaxDropdownHeight();
	});
});

Template.mainNavigationTopItemFilterDropdown.onDestroyed(function () {
	if (filterResizeSensor !== undefined) {
		filterResizeSensor.off('resize');
	}
});
