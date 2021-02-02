import "./sortResults.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../util/filter";

/*
 * ############################################################################
 * filterItemSortResults
 * ############################################################################
 */

Template.filterItemSortResults.helpers({
	getSortTopicIcon: function () {
		let filter = Filter.getActiveFilter();
		if (filter !== undefined) {
			switch (filter.name) {
				case 1:
					return '<span class="fas fa-sort-alpha-down cards-filter-element"></span>';
				case-1:
					return '<span class="fas fa-sort-alpha-up-alt cards-filter-element"></span>';
			}
		}
	},
	getSortCreatedDateIcon: function () {
		let filter = Filter.getActiveFilter();
		if (filter !== undefined) {
			switch (filter.date) {
				case 1:
					return '<span class="fas fa-sort-numeric-down cards-filter-element"></span>';
				case-1:
					return '<span class="fas fa-sort-numeric-up-alt cards-filter-element"></span>';
			}
		}
	},
	getSortUpdatedDateIcon: function () {
		let filter = Filter.getActiveFilter();
		if (filter !== undefined) {
			switch (filter.dateUpdated) {
				case 1:
					return '<span class="fas fa-sort-numeric-down cards-filter-element"></span>';
				case-1:
					return '<span class="fas fa-sort-numeric-up-alt cards-filter-element"></span>';
			}
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
