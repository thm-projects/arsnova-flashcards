import "./sortResults.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../api/filter";

/*
 * ############################################################################
 * filterItemSortResults
 * ############################################################################
 */

Template.filterItemSortResults.helpers({
	getSortTopicIcon: function () {
		switch (Filter.getActiveFilter().name) {
			case 1:
				return '<i class="fa fa-sort-alpha-down cards-filter-element"></i>';
			case-1:
				return '<i class="fa fa-sort-alpha-up-alt cards-filter-element"></i>';

		}
	},
	getSortCreatedDateIcon: function () {
		switch (Filter.getActiveFilter().date) {
			case 1:
				return '<i class="fa fa-sort-numeric-down cards-filter-element"></i>';
			case-1:
				return '<i class="fa fa-sort-numeric-up-alt cards-filter-element"></i>';

		}
	},
	getSortUpdatedDateIcon: function () {
		switch (Filter.getActiveFilter().dateUpdated) {
			case 1:
				return '<i class="fa fa-sort-numeric-down cards-filter-element"></i>';
			case-1:
				return '<i class="fa fa-sort-numeric-up-alt cards-filter-element"></i>';

		}
	}
});

Template.filterItemSortResults.events({
	'click .topicBtn': function () {
		Filter.setSortFilter(0);
	},
	'click .createdDateBtn': function () {
		Filter.setSortFilter(1);
	},
	'click .updatedDateBtn': function () {
		Filter.setSortFilter(2);
	}
});
