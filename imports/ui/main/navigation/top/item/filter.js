import {FilterNavigation} from "../../../../../api/filterNavigation";
import {Template} from "meteor/templating";
import "./filter.html";

/*
* ############################################################################
* mainNavigationTopItemFilter
* ############################################################################
*/

Template.mainNavigationTopItemFilter.onRendered(function () {
	if (FilterNavigation.gotAutoOpenFeature) {
		FilterNavigation.showDropdown();
	}
});


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
