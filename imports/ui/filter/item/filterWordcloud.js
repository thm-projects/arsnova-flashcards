import "./filterWordcloud.html";
import {Template} from "meteor/templating";
import {Filter} from "../../../api/filter";
import {Cardsets} from "../../../api/cardsets";

/*
 * ############################################################################
 * filterItemFilterWordcloud
 * ############################################################################
 */

Template.filterItemFilterWordcloud.helpers({
	hasWordcloudFilter: function () {
		return Filter.getFilterQuery().wordcloud !== undefined;
	},
	resultsFilterWordcloud: function (wordcloud) {
		return Filter.getFilterQuery().wordcloud === wordcloud;
	},
	gotRecommendedCardsets: function () {
		let query = Filter.getFilterQuery();
		query.wordcloud = true;
		return Cardsets.findOne(query);
	},
	gotNotRecommendedCardsets: function () {
		let query = Filter.getFilterQuery();
		query.wordcloud = false;
		return Cardsets.findOne(query);
	}
});

Template.filterItemFilterWordcloud.events({
	'click .noFilterWordcloud': function () {
		Filter.setActiveFilter(undefined, "wordcloud");
	},
	'click .filterWordcloud': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "wordcloud");
	}
});
