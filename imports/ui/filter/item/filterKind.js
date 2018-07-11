import "./filterKind.html";
import {Template} from "meteor/templating";
import {FilterNavigation} from "../../../api/filterNavigation";
import {Filter} from "../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterKind
 * ############################################################################
 */

Template.filterItemFilterKind.helpers({
	getPersonalKindTag: function () {
		return Filter.getPersonalKindTag();
	},
	getFreeKindTag: function () {
		return Filter.getFreeKindTag();
	},
	getEduKindTag: function () {
		return Filter.getEduKindTag();
	},
	getProKindTag: function () {
		return Filter.getProKindTag();
	},
	gotPersonalKind: function () {
		return FilterNavigation.gotPersonalKindFilter(FilterNavigation.getRouteId());
	},
	gotFreeKind: function () {
		return FilterNavigation.gotFreeKindFilter(FilterNavigation.getRouteId());
	},
	gotEduKind: function () {
		return FilterNavigation.gotEduKindFilter(FilterNavigation.getRouteId());
	},
	gotProKind: function () {
		return FilterNavigation.gotProKindFilter(FilterNavigation.getRouteId());
	},
	isPersonalKindActive: function () {
		let filter = Filter.getActiveFilter();
		return filter.kind.includes(Filter.getPersonalKindTag());
	},
	isFreeKindActive: function () {
		let filter = Filter.getActiveFilter();
		return filter.kind.includes(Filter.getFreeKindTag());
	},
	isEduKindActive: function () {
		let filter = Filter.getActiveFilter();
		return filter.kind.includes(Filter.getEduKindTag());
	},
	isProKindActive: function () {
		let filter = Filter.getActiveFilter();
		return filter.kind.includes(Filter.getProKindTag());
	}
});

Template.filterItemFilterKind.events({
	'click .kindButtonActive': function (evt) {
		let filter = [];
		$("#filterCheckbox .kindButtonActive").each(function () {
			if ($(this).data("kind") !== $(evt.target).data("kind")) {
				filter.push($(this).data("kind"));
			}
		});
		Filter.setActiveFilter(filter, "kind");
	},
	'click .kindButtonInactive': function (evt) {
		let filter = [];
		$("#filterCheckbox .kindButtonActive").each(function () {
			filter.push($(this).data("kind"));
		});
		filter.push($(evt.target).data("kind"));
		Filter.setActiveFilter(filter, "kind");
	}
});
