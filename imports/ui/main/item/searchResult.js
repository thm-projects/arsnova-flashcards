import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./searchResult.html";
import {MainNavigation} from "../../../api/mainNavigation";

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
	'click #searchResults a': function () {
		MainNavigation.clearSearch();
	}
});
