import {MainNavigation} from "../../../../../api/mainNavigation";
import {FilterNavigation} from "../../../../../api/filterNavigation";
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
		if ($('.navbar-cards-filter-dropdown').hasClass('active')) {
			$('.navbar-cards-filter-dropdown').removeClass('active');
		} else {
			$('.navbar-cards-filter-dropdown').addClass('active');
			FilterNavigation.setMaxDropdownHeight();
			MainNavigation.closeCollapse();
		}
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
