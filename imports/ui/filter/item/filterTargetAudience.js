import "./filterTargetAudience.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";

/*
 * ############################################################################
 * filterItemFilterTargetAudience
 * ############################################################################
 */

Template.filterItemFilterTargetAudience.helpers({
	hasTargetAudienceFilter: function () {
		return Filter.getFilterQuery().targetAudience !== undefined;
	}
});

Template.filterItemFilterTargetAudience.events({
	'click .noFilterTargetAudience': function () {
		Filter.setActiveFilter(undefined, "targetAudience");
	},
	'click .filterTargetAudience': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "targetAudience");
	}
});
