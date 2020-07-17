import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./searchResult.html";
import {MainNavigation} from "../../../util/mainNavigation";
import {Route} from "../../../util/route.js";

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
	'click .open-search-result': function () {
		if (!Route.isShuffle() && !Route.isEditShuffle()) {
			MainNavigation.clearSearch();
			$(document.body).addClass('modal-backdrop');
		}
	}
});
