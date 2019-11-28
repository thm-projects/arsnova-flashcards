import "./filterUseCase.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../../api/filter";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

/*
 * ############################################################################
 * filterItemFilterUseCase
 * ############################################################################
 */

Template.filterItemFilterUseCase.helpers({
	hasUseCaseFilter: function () {
		return Filter.getFilterQuery()['useCase.enabled'] !== undefined;
	},
	resultsFilterUseCase: function (useCase) {
		return Filter.getFilterQuery()['useCase.enabled'] === useCase;
	},
	gotUseCaseCardsets: function () {
		let query = Filter.getFilterQuery();
		query['useCase.enabled'] = true;
		return Cardsets.findOne(query);
	}
});

Template.filterItemFilterUseCase.events({
	'click .noFilterUseCase': function () {
		Filter.setActiveFilter(undefined, "useCase");
	},
	'click .filterUseCase': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "useCase");
	}
});
