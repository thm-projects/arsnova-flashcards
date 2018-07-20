import "./filterModule.html";
import {CourseIterations} from "../../../api/courseIterations";
import {Filter} from "../../../api/filter";
import {TargetAudience} from "../../../api/targetAudience";


/*
 * ############################################################################
 * filterItemFilterModule
 * ############################################################################
 */

Template.filterItemFilterModule.helpers({
	hasModuleFilter: function () {
		return (Filter.getFilterQuery().module !== undefined || Filter.getFilterQuery().noModule !== undefined);
	},
	hasNoModuleFilter: function () {
		return Filter.getFilterQuery().noModule !== undefined;
	},
	getModules: function () {
		let query = Filter.getFilterQuery();
		query.targetAudience = {$in: TargetAudience.getTargetAudienceWithModule()};
		delete query.module;
		delete query.noModule;
		return _.uniq(CourseIterations.find(query, {sort: {"module": 1}}).fetch(), function (item) {
			return item.moduleNum;
		});
	},
	resultFilterModule: function (module) {
		return Filter.getFilterQuery().module === module;
	}
});

Template.filterItemFilterModule.events({
	'click .noFilterModule': function () {
		Filter.setActiveFilter(undefined, "module");
		Filter.setActiveFilter(undefined, "noModule");
	},
	'click .filterNoModule': function () {
		Filter.setActiveFilter(undefined, "module");
		Filter.setActiveFilter(true, "noModule");
	},
	'click .filterModule': function (event) {
		Filter.setActiveFilter(undefined, "noModule");
		Filter.setActiveFilter($(event.target).data('id'), "module");
	}
});
