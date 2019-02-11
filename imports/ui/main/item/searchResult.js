import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./searchResult.html";

/*
* ############################################################################
* mainItemSearchResult
* ############################################################################
*/

Template.mainItemSearchResult.helpers({
	searchCategories: function () {
		return Session.get('searchCategoriesResult');
	}
});

Template.mainItemSearchResult.events({
	'click #searchResults': function () {
		$('.searchDropdown').removeClass("open");
		$('.input-search').val('');
	}
});
