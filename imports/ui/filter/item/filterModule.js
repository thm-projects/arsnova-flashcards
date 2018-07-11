import "./filterModule.html";
import {CourseIterations} from "../../../api/courseIterations";
import {Filter} from "../../../api/filter";


/*
 * ############################################################################
 * filterItemFilterModule
 * ############################################################################
 */

Template.filterItemFilterModule.helpers({
	hasModuleFilter: function () {
		return Filter.getFilterQuery().module !== undefined;
	},
	getModules: function () {
		let query = Filter.getFilterQuery();
		delete query.module;
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
	},
	'click .filterNoModule': function () {
		Filter.setActiveFilter(true, "noModule");
	},
	'click .filterModule': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "module");
	}
});
